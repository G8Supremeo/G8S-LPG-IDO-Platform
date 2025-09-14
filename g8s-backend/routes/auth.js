const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const USE_MONGO = (process.env.USE_MONGO || '').toLowerCase() === 'true';
let User;
if (USE_MONGO) {
  User = require('../models/User');
}
const { SupabaseService } = require('../supabase-config');
const { protect } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordReset, 
  validatePasswordUpdate 
} = require('../middleware/validation');
const notificationService = require('../services/notificationService');
const emailService = require('../services/emailService');

const router = express.Router();
const supabaseService = global.supabaseService || new SupabaseService();

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user (Supabase-native if USE_MONGO=false)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!USE_MONGO) {
      if (!supabaseService || !supabaseService.admin || !supabaseService.client) {
        return res.status(500).json({ success: false, error: 'Supabase not configured' });
      }

      // Create auth user
      const { data: created, error: createErr } = await supabaseService.admin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: { firstName, lastName }
      });
      if (createErr) {
        return res.status(400).json({ success: false, error: createErr.message });
      }

      const authUser = created.user;

      // Upsert profile row in users table
      const { error: upsertErr } = await supabaseService.client
        .from(supabaseService.tables.USERS)
        .upsert({
          id: authUser.id,
          email,
          first_name: firstName,
          last_name: lastName,
          is_active: true
        });
      if (upsertErr) {
        return res.status(400).json({ success: false, error: upsertErr.message });
      }

      const token = generateToken(authUser.id);
      return res.status(201).json({
        success: true,
        data: {
          user: {
            id: authUser.id,
            email,
            firstName,
            lastName,
            emailVerified: !!authUser.email_confirmed_at,
            accountStatus: 'active'
          },
          token
        },
        message: 'User registered successfully. Please verify your email from Supabase.'
      });
    }

    // Legacy Mongo path
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists with this email' });
    }
    const user = await User.create({ email, password, firstName, lastName });
    const token = generateToken(user._id);
    return res.status(201).json({
      success: true,
      data: { user: { id: user._id, email, firstName, lastName }, token }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during registration' });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!USE_MONGO) {
      if (!supabaseService || !supabaseService.client) {
        return res.status(500).json({ success: false, error: 'Supabase not configured' });
      }

      const { data, error } = await supabaseService.client.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const userId = data.user.id;
      const { data: profile } = await supabaseService.client
        .from(supabaseService.tables.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      const token = generateToken(userId);
      return res.json({
        success: true,
        data: {
          user: {
            id: userId,
            email: data.user.email,
            firstName: profile?.first_name || '',
            lastName: profile?.last_name || '',
            emailVerified: !!data.user.email_confirmed_at,
            accountStatus: profile?.is_active ? 'active' : 'inactive'
          },
          token
        }
      });
    }

    // Legacy Mongo path
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const token = generateToken(user._id);
    return res.json({ success: true, data: { user: { id: user._id, email: user.email }, token } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    if (!USE_MONGO) {
      const user = req.user; // set in middleware from Supabase
      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            accountStatus: user.is_active ? 'active' : 'inactive'
          }
        }
      });
    }

    const user = await User.findById(req.user._id).select('-password');
    return res.json({ success: true, data: { user } });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.accountStatus = 'active';
    await user.save();

    // Generate token
    const authToken = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          accountStatus: user.accountStatus
        },
        token: authToken
      },
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during email verification'
    });
  }
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
router.post('/resend-verification', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send verification email
    try {
      await emailService.sendEmailVerificationEmail(user, emailVerificationToken);
    } catch (emailError) {
      console.error('Error sending email verification:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', validatePasswordReset, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send password reset email'
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token and password are required'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate token
    const authToken = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token: authToken
      },
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password reset'
    });
  }
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
router.put('/update-password', protect, validatePasswordUpdate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      },
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password update'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // Update last activity
    const user = await User.findById(req.user._id);
    user.lastActivity = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
router.post('/refresh', protect, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user._id);

    res.json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during token refresh'
    });
  }
});

module.exports = router;

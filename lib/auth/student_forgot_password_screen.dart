import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

class StudentForgotPasswordScreen extends StatefulWidget {
  const StudentForgotPasswordScreen({super.key});

  @override
  State<StudentForgotPasswordScreen> createState() =>
      _StudentForgotPasswordScreenState();
}

enum _Step { email, otp, newPassword }

class _StudentForgotPasswordScreenState
    extends State<StudentForgotPasswordScreen> {
  _Step _step = _Step.email;

  final _emailCtrl = TextEditingController();
  final List<TextEditingController> _otpCtrls =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _otpFocus = List.generate(6, (_) => FocusNode());
  final _passCtrl = TextEditingController();
  final _confirmPassCtrl = TextEditingController();

  bool _obscurePass = true;
  bool _obscureConfirm = true;
  bool _loading = false;
  String? _error;

  static const _primary = Color(0xFF3B82F6);
  static const _baseUrl = 'https://livesite-backend-74ut.onrender.com';

  @override
  void dispose() {
    _emailCtrl.dispose();
    for (final c in _otpCtrls) { c.dispose(); }
    for (final f in _otpFocus) { f.dispose(); }
    _passCtrl.dispose();
    _confirmPassCtrl.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty || !RegExp(r'^[\w.+-]+@[\w-]+\.\w{2,}$').hasMatch(email)) {
      _setError('Enter a valid email address.');
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/student/forget-pass/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );
      if (!mounted) return;
      if (res.statusCode == 200 || res.statusCode == 201) {
        setState(() => _step = _Step.otp);
      } else {
        final body = jsonDecode(res.body);
        _setError(body['message'] ?? 'Could not send OTP. Try again.');
      }
    } catch (_) {
      _setError('Network error. Check your connection.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _verifyOtp() async {
    final otp = _otpCtrls.map((c) => c.text).join();
    if (otp.length < 6) { _setError('Enter the 6-digit OTP.'); return; }
    setState(() { _loading = true; _error = null; });
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/student/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': _emailCtrl.text.trim(), 'otp': otp}),
      );
      if (!mounted) return;
      if (res.statusCode == 200 || res.statusCode == 201) {
        setState(() => _step = _Step.newPassword);
      } else {
        final body = jsonDecode(res.body);
        _setError(body['message'] ?? 'Invalid OTP. Try again.');
      }
    } catch (_) {
      _setError('Network error. Check your connection.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _updatePassword() async {
    final pass = _passCtrl.text;
    final confirm = _confirmPassCtrl.text;
    if (pass.isEmpty) { _setError('Enter a new password.'); return; }
    if (pass.length < 6) { _setError('Password must be at least 6 characters.'); return; }
    if (pass != confirm) { _setError('Passwords do not match.'); return; }

    setState(() { _loading = true; _error = null; });
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/student/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': _emailCtrl.text.trim(),
          'password': pass,
        }),
      );
      if (!mounted) return;
      if (res.statusCode == 200 || res.statusCode == 201) {
        _showSuccess();
      } else {
        final body = jsonDecode(res.body);
        _setError(body['message'] ?? 'Failed to update password. Try again.');
      }
    } catch (_) {
      _setError('Network error. Check your connection.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _setError(String msg) => setState(() => _error = msg);

  void _showSuccess() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.lock_open_rounded, color: _primary, size: 64),
            const SizedBox(height: 16),
            const Text('Password Updated!',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Your password has been reset. Please login with your new password.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 13)),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _primary,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.pop(context); // close dialog
                  Navigator.pop(context); // back to login
                },
                child: const Text('Back to Login',
                    style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String get _stepTitle {
    switch (_step) {
      case _Step.email: return 'Forgot Password';
      case _Step.otp: return 'Verify Email';
      case _Step.newPassword: return 'New Password';
    }
  }

  String get _stepSubtitle {
    switch (_step) {
      case _Step.email: return 'We\'ll send an OTP to your email';
      case _Step.otp: return 'OTP sent to ${_emailCtrl.text.trim()}';
      case _Step.newPassword: return 'Set a strong new password 🔐';
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.sizeOf(context).height;
    final hPad = MediaQuery.sizeOf(context).width < 380 ? 20.0 : 24.0;
    final headerH = (screenHeight * 0.25).clamp(180.0, 260.0);

    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Header
          Stack(
            children: [
              Image.network(
                'https://livesite-two.vercel.app/backgrounds/login_bg.jpeg',
                width: double.infinity,
                height: headerH,
                fit: BoxFit.cover,
              ),
              Container(
                height: headerH,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.white],
                  ),
                ),
              ),
              Positioned(
                top: MediaQuery.paddingOf(context).top + 12,
                left: 16,
                child: CircleAvatar(
                  backgroundColor: Colors.white.withValues(alpha: 0.9),
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back_ios_new_rounded,
                        size: 18, color: Color(0xFF1E293B)),
                    onPressed: () {
                      if (_step == _Step.otp) {
                        setState(() { _step = _Step.email; _error = null; });
                      } else if (_step == _Step.newPassword) {
                        setState(() { _step = _Step.otp; _error = null; });
                      } else {
                        Navigator.pop(context);
                      }
                    },
                  ),
                ),
              ),
              Positioned(
                top: MediaQuery.paddingOf(context).top + 12,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                      color: _primary, borderRadius: BorderRadius.circular(20)),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.lock_reset_rounded, color: Colors.white, size: 15),
                      SizedBox(width: 5),
                      Text('Reset',
                          style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                              fontSize: 13)),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Step indicator
          Padding(
            padding: EdgeInsets.symmetric(horizontal: hPad, vertical: 4),
            child: _StepIndicator(current: _step),
          ),

          // Form
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(hPad, 8, hPad, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_stepSubtitle,
                      style: const TextStyle(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 4),
                  Text(_stepTitle,
                      style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF1E293B))),
                  const SizedBox(height: 20),

                  if (_error != null) ...[
                    _ErrorBanner(message: _error!),
                    const SizedBox(height: 14),
                  ],

                  if (_step == _Step.email) _buildEmailStep(),
                  if (_step == _Step.otp) _buildOtpStep(),
                  if (_step == _Step.newPassword) _buildNewPasswordStep(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmailStep() {
    return Column(
      children: [
        _field(
          ctrl: _emailCtrl,
          hint: 'Email address',
          icon: Icons.email_outlined,
          keyboardType: TextInputType.emailAddress,
        ),
        const SizedBox(height: 24),
        _primaryButton(label: 'Send OTP', icon: Icons.send_rounded, onPressed: _sendOtp),
        const SizedBox(height: 16),
        Center(
          child: TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Back to Login',
                style: TextStyle(color: _primary, fontWeight: FontWeight.w600)),
          ),
        ),
      ],
    );
  }

  Widget _buildOtpStep() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: List.generate(
            6,
            (i) => _OtpBox(
              controller: _otpCtrls[i],
              focusNode: _otpFocus[i],
              onChanged: (val) {
                if (val.isNotEmpty && i < 5) {
                  _otpFocus[i + 1].requestFocus();
                } else if (val.isEmpty && i > 0) {
                  _otpFocus[i - 1].requestFocus();
                }
              },
            ),
          ),
        ),
        const SizedBox(height: 8),
        Align(
          alignment: Alignment.centerRight,
          child: TextButton(
            onPressed: _loading ? null : _sendOtp,
            child: const Text('Resend OTP',
                style: TextStyle(color: _primary, fontSize: 13)),
          ),
        ),
        const SizedBox(height: 12),
        _primaryButton(label: 'Verify OTP', icon: Icons.verified_rounded, onPressed: _verifyOtp),
      ],
    );
  }

  Widget _buildNewPasswordStep() {
    return Column(
      children: [
        _field(
          ctrl: _passCtrl,
          hint: 'New Password',
          icon: Icons.lock_outline_rounded,
          obscure: _obscurePass,
          suffix: IconButton(
            icon: Icon(
                _obscurePass ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                size: 20, color: Colors.grey),
            onPressed: () => setState(() => _obscurePass = !_obscurePass),
          ),
        ),
        const SizedBox(height: 12),
        _field(
          ctrl: _confirmPassCtrl,
          hint: 'Confirm New Password',
          icon: Icons.lock_outline_rounded,
          obscure: _obscureConfirm,
          suffix: IconButton(
            icon: Icon(
                _obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                size: 20, color: Colors.grey),
            onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
          ),
        ),
        const SizedBox(height: 24),
        _primaryButton(
            label: 'Update Password',
            icon: Icons.check_circle_outline_rounded,
            onPressed: _updatePassword),
      ],
    );
  }

  Widget _primaryButton(
      {required String label, required IconData icon, required VoidCallback onPressed}) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: _primary,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
        onPressed: _loading ? null : onPressed,
        child: _loading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5))
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(icon, color: Colors.white, size: 18),
                  const SizedBox(width: 8),
                  Text(label,
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                ],
              ),
      ),
    );
  }

  Widget _field({
    required TextEditingController ctrl,
    required String hint,
    required IconData icon,
    bool obscure = false,
    Widget? suffix,
    TextInputType? keyboardType,
  }) {
    return TextField(
      controller: ctrl,
      obscureText: obscure,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
        prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
        suffixIcon: suffix,
        filled: true,
        fillColor: const Color(0xFFF1F5F9),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
      ),
    );
  }
}

// ── Step indicator ─────────────────────────────────────────────────────────────
class _StepIndicator extends StatelessWidget {
  final _Step current;
  const _StepIndicator({required this.current});

  @override
  Widget build(BuildContext context) {
    final labels = ['Email', 'OTP', 'Password'];
    final currentIndex = _Step.values.indexOf(current);

    return Row(
      children: List.generate(labels.length * 2 - 1, (i) {
        if (i.isOdd) {
          final filled = (i ~/ 2) < currentIndex;
          return Expanded(
            child: Container(
              height: 2,
              color: filled ? const Color(0xFF3B82F6) : const Color(0xFFE2E8F0),
            ),
          );
        }
        final idx = i ~/ 2;
        final done = idx < currentIndex;
        final active = idx == currentIndex;
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: done || active
                    ? const Color(0xFF3B82F6)
                    : const Color(0xFFE2E8F0),
              ),
              child: Center(
                child: done
                    ? const Icon(Icons.check_rounded, color: Colors.white, size: 14)
                    : Text('${idx + 1}',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: active ? Colors.white : Colors.grey)),
              ),
            ),
            const SizedBox(height: 4),
            Text(labels[idx],
                style: TextStyle(
                    fontSize: 10,
                    color: active
                        ? const Color(0xFF3B82F6)
                        : Colors.grey.shade400)),
          ],
        );
      }),
    );
  }
}

// ── OTP input box ─────────────────────────────────────────────────────────────
class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final ValueChanged<String> onChanged;

  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 44,
      height: 52,
      child: TextField(
        controller: controller,
        focusNode: focusNode,
        textAlign: TextAlign.center,
        maxLength: 1,
        keyboardType: TextInputType.number,
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1E293B)),
        decoration: InputDecoration(
          counterText: '',
          filled: true,
          fillColor: const Color(0xFFF1F5F9),
          contentPadding: EdgeInsets.zero,
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF3B82F6), width: 2)),
        ),
        onChanged: onChanged,
      ),
    );
  }
}

// ── Error banner ──────────────────────────────────────────────────────────────
class _ErrorBanner extends StatelessWidget {
  final String message;
  const _ErrorBanner({required this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFCA5A5)),
      ),
      child: Row(
        children: [
          const Icon(Icons.error_outline_rounded,
              color: Color(0xFFEF4444), size: 18),
          const SizedBox(width: 8),
          Expanded(
              child: Text(message,
                  style: const TextStyle(color: Color(0xFFDC2626), fontSize: 13))),
        ],
      ),
    );
  }
}

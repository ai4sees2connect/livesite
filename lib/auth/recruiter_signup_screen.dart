import 'package:flutter/material.dart';

class RecruiterSignupScreen extends StatefulWidget {
  const RecruiterSignupScreen({super.key});

  @override
  State<RecruiterSignupScreen> createState() => _RecruiterSignupScreenState();
}

class _RecruiterSignupScreenState extends State<RecruiterSignupScreen> {
  bool _obscurePass = true;
  bool _obscureConfirm = true;

  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _passCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  String? _validatePassword(String pass) {
    if (pass.length < 8) return 'Password must be at least 8 characters.';
    if (!pass.contains(RegExp(r'[A-Z]'))) return 'Password must include an uppercase letter.';
    if (!pass.contains(RegExp(r'[a-z]'))) return 'Password must include a lowercase letter.';
    if (!pass.contains(RegExp(r'[0-9]'))) return 'Password must include a number.';
    if (!pass.contains(RegExp(r'[!@#\$%^&*(),.?":{}|<>_\-]'))) return 'Password must include a special character.';
    return null;
  }

  void _submit() {
    final pass = _passCtrl.text;
    final confirm = _confirmCtrl.text;
    if (pass.isEmpty) { setState(() => _error = 'Enter a password.'); return; }
    final err = _validatePassword(pass);
    if (err != null) { setState(() => _error = err); return; }
    if (pass != confirm) { setState(() => _error = 'Passwords do not match.'); return; }
    setState(() => _error = null);
    // TODO: call recruiter signup API
  }

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF5B5CEB);
    final screenHeight = MediaQuery.sizeOf(context).height;
    final hPad = MediaQuery.sizeOf(context).width < 380 ? 20.0 : 24.0;
    final headerH = (screenHeight * 0.25).clamp(180.0, 280.0);

    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          Stack(
            children: [
              Image.network(
                'https://livesite-two.vercel.app/people/intern_pic.jpeg',
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
                    icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: Color(0xFF1E293B)),
                    onPressed: () => Navigator.pop(context),
                  ),
                ),
              ),
              Positioned(
                top: MediaQuery.paddingOf(context).top + 12,
                right: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(color: primary, borderRadius: BorderRadius.circular(20)),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.business_center_rounded, color: Colors.white, size: 15),
                      SizedBox(width: 5),
                      Text('Recruiter', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(hPad, 4, hPad, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Start hiring today 🏢', style: TextStyle(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 4),
                  const Text('Create Account',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                  const SizedBox(height: 20),
                  _field(hint: 'Full Name', icon: Icons.person_outline_rounded),
                  const SizedBox(height: 12),
                  _field(hint: 'Company Name', icon: Icons.business_outlined),
                  const SizedBox(height: 12),
                  _field(hint: 'Work Email', icon: Icons.email_outlined),
                  const SizedBox(height: 12),
                  _field(hint: 'Phone Number', icon: Icons.phone_outlined),
                  const SizedBox(height: 12),
                  _field(
                    hint: 'Password',
                    icon: Icons.lock_outline_rounded,
                    ctrl: _passCtrl,
                    obscure: _obscurePass,
                    suffix: IconButton(
                      icon: Icon(_obscurePass ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          size: 20, color: Colors.grey),
                      onPressed: () => setState(() => _obscurePass = !_obscurePass),
                    ),
                  ),
                  const SizedBox(height: 12),
                  _field(
                    hint: 'Confirm Password',
                    icon: Icons.lock_outline_rounded,
                    ctrl: _confirmCtrl,
                    obscure: _obscureConfirm,
                    suffix: IconButton(
                      icon: Icon(_obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          size: 20, color: Colors.grey),
                      onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFEEEE),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: Color(0xFFEF4444), size: 16),
                          const SizedBox(width: 8),
                          Expanded(child: Text(_error!, style: const TextStyle(color: Color(0xFFEF4444), fontSize: 13))),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primary,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _submit,
                      child: const Text('Create Account',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Already have an account?', style: TextStyle(color: Colors.grey, fontSize: 13)),
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Login', style: TextStyle(color: primary, fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _field({required String hint, required IconData icon, TextEditingController? ctrl, bool obscure = false, Widget? suffix}) {
    return TextField(
      controller: ctrl,
      obscureText: obscure,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
        prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
        suffixIcon: suffix,
        filled: true,
        fillColor: const Color(0xFFF8F7FF),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
      ),
    );
  }
}

import 'package:flutter/material.dart';

class StudentSignupScreen extends StatefulWidget {
  const StudentSignupScreen({super.key});

  @override
  State<StudentSignupScreen> createState() => _StudentSignupScreenState();
}

class _StudentSignupScreenState extends State<StudentSignupScreen> {
  bool _obscurePass = true;
  bool _obscureConfirm = true;

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);
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
                      Icon(Icons.school_rounded, color: Colors.white, size: 15),
                      SizedBox(width: 5),
                      Text('Student', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
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
                  const Text('Join us today 🎓', style: TextStyle(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 4),
                  const Text('Create Account',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                  const SizedBox(height: 20),
                  _field(hint: 'Full Name', icon: Icons.person_outline_rounded),
                  const SizedBox(height: 12),
                  _field(hint: 'Email address', icon: Icons.email_outlined),
                  const SizedBox(height: 12),
                  _field(hint: 'College / University', icon: Icons.school_outlined),
                  const SizedBox(height: 12),
                  _field(
                    hint: 'Password',
                    icon: Icons.lock_outline_rounded,
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
                    obscure: _obscureConfirm,
                    suffix: IconButton(
                      icon: Icon(_obscureConfirm ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          size: 20, color: Colors.grey),
                      onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                    ),
                  ),
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
                      onPressed: () {},
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

  Widget _field({required String hint, required IconData icon, bool obscure = false, Widget? suffix}) {
    return TextField(
      obscureText: obscure,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
        prefixIcon: Icon(icon, color: Colors.grey.shade400, size: 20),
        suffixIcon: suffix,
        filled: true,
        fillColor: const Color(0xFFF1F5F9),
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:internship_app/auth/student_signup_screen.dart';
import 'package:internship_app/student/home_screen.dart';

class StudentLoginScreen extends StatefulWidget {
  const StudentLoginScreen({super.key});

  @override
  State<StudentLoginScreen> createState() => _StudentLoginScreenState();
}

class _StudentLoginScreenState extends State<StudentLoginScreen> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);
    final screenHeight = MediaQuery.sizeOf(context).height;
    final hPad = MediaQuery.sizeOf(context).width < 380 ? 20.0 : 24.0;
    final headerH = (screenHeight * 0.32).clamp(220.0, 340.0);

    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Responsive header image
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
                  const Text('Welcome back 👋', style: TextStyle(fontSize: 14, color: Colors.grey)),
                  const SizedBox(height: 4),
                  const Text('Student Login',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                  const SizedBox(height: 24),
                  _field(hint: 'Email address', icon: Icons.email_outlined),
                  const SizedBox(height: 14),
                  _field(
                    hint: 'Password',
                    icon: Icons.lock_outline_rounded,
                    obscure: _obscure,
                    suffix: IconButton(
                      icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          size: 20, color: Colors.grey),
                      onPressed: () => setState(() => _obscure = !_obscure),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {},
                      child: const Text('Forgot Password?',
                          style: TextStyle(color: primary, fontWeight: FontWeight.w600)),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primary,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () => Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (_) => const StudentHomeScreen()),
                      ),
                      child: const Text('Login',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text("Don't have an account?", style: TextStyle(color: Colors.grey, fontSize: 13)),
                      TextButton(
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const StudentSignupScreen()),
                        ),
                        child: const Text('Sign Up', style: TextStyle(color: primary, fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  Center(
                    child: Column(
                      children: [
                        Icon(Icons.workspace_premium_outlined, size: 40, color: primary.withValues(alpha: .15)),
                        const SizedBox(height: 8),
                        Text('Build Your Career with InternsNest',
                            style: TextStyle(color: Colors.grey.shade500, fontWeight: FontWeight.w500, fontSize: 13)),
                        const SizedBox(height: 4),
                        Text('Find • Apply • Get Hired',
                            style: TextStyle(color: Colors.grey.shade400, fontSize: 12)),
                      ],
                    ),
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
        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
      ),
    );
  }
}

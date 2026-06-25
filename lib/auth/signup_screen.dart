import 'package:flutter/material.dart';
import 'package:internship_app/auth/login_scree.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  bool isStudent = true;

  @override
Widget build(BuildContext context) {
  const primary = Color(0xFF3B82F6);

  return Scaffold(
    backgroundColor: Colors.white,
    body: Column(
      children: [
        // Full Width Top Image
        Image.network(
          'https://livesite-two.vercel.app/backgrounds/login_bg.jpeg',
          width: double.infinity,
          height: 340,
          fit: BoxFit.cover,
        ),
    
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 10),
    
                const Text(
                  "Create Account",
                  style: TextStyle(
                    fontSize: 34,
                    fontWeight: FontWeight.bold,
                  ),
                ),
    
                const SizedBox(height: 30),
    
                // Student / Recruiter Toggle
                Container(
                  height: 52,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => isStudent = true),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            decoration: BoxDecoration(
                              color: isStudent
                                  ? primary
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Center(
                              child: Text(
                                "Student",
                                style: TextStyle(
                                  color: isStudent
                                      ? Colors.white
                                      : Colors.black54,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => isStudent = false),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            decoration: BoxDecoration(
                              color: !isStudent
                                  ? primary
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Center(
                              child: Text(
                                "Recruiter",
                                style: TextStyle(
                                  color: !isStudent
                                      ? Colors.white
                                      : Colors.black54,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
    
                const SizedBox(height: 30),
    
                _field("Full Name"),
    
                const SizedBox(height: 16),
    
                _field("Email"),
    
                const SizedBox(height: 16),
    
                _field("Password", obscure: true),
    
                const SizedBox(height: 16),
    
                _field("Confirm Password", obscure: true),
    
                const SizedBox(height: 25),
    
                SizedBox(
                  width: double.infinity,
                  height: 55,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: () {},
                    child: const Text(
                      "Create Account",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
    
                const SizedBox(height: 35),
    
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Already have an account?"),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const LoginScreen(),
                          ),
                        );
                      },
                      child: const Text("Login"),
                    ),
                  ],
                ),
    
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ],
    ),
  );
}

Widget _field(String hint, {bool obscure = false}) {
  return TextField(
    obscureText: obscure,
    decoration: InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: Colors.grey.shade100,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 18,
        vertical: 18,
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
    ),
  );
}}
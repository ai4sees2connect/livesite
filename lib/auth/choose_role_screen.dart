import 'package:flutter/material.dart';
import 'package:internship_app/auth/recruiter_login_screen.dart';
import 'package:internship_app/auth/student_login_screen.dart';
import 'package:lottie/lottie.dart';

class ChooseRoleScreen extends StatelessWidget {
  const ChooseRoleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xff5B5CEB);
    final size = MediaQuery.sizeOf(context);
    final hPad = size.width < 380 ? 18.0 : 24.0;
    final lottieH = (size.height * 0.25).clamp(160.0, 260.0);

    return Scaffold(
      backgroundColor: const Color(0xffF9FAFF),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xffEEF2FF), Colors.white],
              ),
            ),
          ),
          Positioned(
            top: -170,
            right: -110,
            child: Container(
              width: 380,
              height: 380,
              decoration: BoxDecoration(
                color: primary.withValues(alpha: .08),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            bottom: -120,
            left: -100,
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                color: primary.withValues(alpha: .06),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            top: size.height * .42,
            left: -120,
            child: Transform.rotate(
              angle: -.35,
              child: Container(
                width: size.width * 1.8,
                height: 80,
                decoration: BoxDecoration(
                  color: primary.withValues(alpha: .10),
                  borderRadius: BorderRadius.circular(50),
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: hPad),
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  Center(
                    child: Image.network(
                      "https://livesite-two.vercel.app/logos/INTERNSNEST%20LOGO.png",
                      width: (size.width * 0.54).clamp(160.0, 220.0),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: lottieH,
                    child: Lottie.asset("assets/Welcome.json", fit: BoxFit.contain),
                  ),
                  const SizedBox(height: 12),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text("Welcome 👋", style: TextStyle(color: Colors.grey, fontSize: 17)),
                  ),
                  const SizedBox(height: 6),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      "Choose your role",
                      style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Color(0xff1F2937)),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      "Find internships or hire talented students.\nSelect how you'd like to continue.",
                      style: TextStyle(fontSize: 15, color: Colors.grey, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Student card
                  Container(
                    decoration: BoxDecoration(
                      color: primary,
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: primary.withValues(alpha: .35),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
                      leading: const CircleAvatar(
                        backgroundColor: Colors.white,
                        child: Icon(Icons.school, color: primary),
                      ),
                      title: const Text("Student",
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 17)),
                      subtitle: const Text("Apply for internships", style: TextStyle(color: Colors.white70, fontSize: 13)),
                      trailing: const Icon(Icons.arrow_forward_ios, color: Colors.white, size: 18),
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const StudentLoginScreen()),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Recruiter card
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: primary, width: 1.6),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: .05), blurRadius: 15),
                      ],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
                      leading: CircleAvatar(
                        backgroundColor: primary.withValues(alpha: .1),
                        child: const Icon(Icons.business_center, color: primary),
                      ),
                      title: const Text("Recruiter",
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                      subtitle: const Text("Hire talented students", style: TextStyle(fontSize: 13)),
                      trailing: const Icon(Icons.arrow_forward_ios, color: primary, size: 18),
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const RecruiterLoginScreen()),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                  Text(
                    "© InternsNest • Build Your Career",
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
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
}

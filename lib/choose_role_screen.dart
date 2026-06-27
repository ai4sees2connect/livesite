import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class ChooseRoleScreen extends StatelessWidget {
  const ChooseRoleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xff5B5CEB);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: const Color(0xffF9FAFF),
      body: Stack(
        children: [
          // Gradient Background
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xffEEF2FF),
                  Colors.white,
                ],
              ),
            ),
          ),

          // Top Circle
          Positioned(
            top: -170,
            right: -110,
            child: Container(
              width: 380,
              height: 380,
              decoration: BoxDecoration(
                color: primary.withOpacity(.08),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // Bottom Left Circle
          Positioned(
            bottom: -120,
            left: -100,
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                color: primary.withOpacity(.06),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // Decorative Circle
          Positioned(
            top: 170,
            left: -40,
            child: Container(
              width: 110,
              height: 110,
              decoration: BoxDecoration(
                color: primary.withOpacity(.08),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // Blue Strip
          Positioned(
            top: size.height * .42,
            left: -120,
            child: Transform.rotate(
              angle: -.35,
              child: Container(
                width: size.width * 1.8,
                height: 80,
                decoration: BoxDecoration(
                  color: primary.withOpacity(.10),
                  borderRadius: BorderRadius.circular(50),
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    const SizedBox(height: 20),

                    // Logo
                    Center(
                      child: Image.network(
                        "https://livesite-two.vercel.app/logos/INTERNSNEST%20LOGO.png",
                        width: 210,
                      ),
                    ),

                    const SizedBox(height: 15),

                    // Animation
                    SizedBox(
                      height: 230,
                      child: Lottie.asset(
                        "assets/Welcome.json",
                        fit: BoxFit.contain,
                      ),
                    ),

                    const SizedBox(height: 15),

                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Welcome 👋",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 18,
                        ),
                      ),
                    ),

                    const SizedBox(height: 8),

                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Choose your role",
                        style: TextStyle(
                          fontSize: 34,
                          fontWeight: FontWeight.bold,
                          color: Color(0xff1F2937),
                        ),
                      ),
                    ),

                    const SizedBox(height: 10),

                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Find internships or hire talented students.\nSelect how you'd like to continue.",
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                          height: 1.4,
                        ),
                      ),
                    ),

                    const SizedBox(height: 30),

                    // Student Card
                    Container(
                      decoration: BoxDecoration(
                        color: primary,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: primary.withOpacity(.35),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          )
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 22,
                          vertical: 10,
                        ),
                        leading: const CircleAvatar(
                          backgroundColor: Colors.white,
                          child: Icon(
                            Icons.school,
                            color: primary,
                          ),
                        ),
                        title: const Text(
                          "Student",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        subtitle: const Text(
                          "Apply for internships",
                          style: TextStyle(
                            color: Colors.white70,
                          ),
                        ),
                        trailing: const Icon(
                          Icons.arrow_forward_ios,
                          color: Colors.white,
                        ),
                        onTap: () {},
                      ),
                    ),

                    const SizedBox(height: 18),

                    // Recruiter Card
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: primary, width: 1.6),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(.05),
                            blurRadius: 15,
                          )
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 22,
                          vertical: 10,
                        ),
                        leading: CircleAvatar(
                          backgroundColor: primary.withOpacity(.1),
                          child: const Icon(
                            Icons.business_center,
                            color: primary,
                          ),
                        ),
                        title: const Text(
                          "Recruiter",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        subtitle: const Text(
                          "Hire talented students",
                        ),
                        trailing: const Icon(
                          Icons.arrow_forward_ios,
                          color: primary,
                        ),
                        onTap: () {},
                      ),
                    ),

                    const SizedBox(height: 40),

                    Text(
                      "© InternsNest • Build Your Career",
                      style: TextStyle(
                        color: Colors.grey.shade600,
                      ),
                    ),

                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
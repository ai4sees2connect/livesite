import 'package:flutter/material.dart';
import 'package:internship_app/choose_role_screen.dart';
import 'package:lottie/lottie.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => const ChooseRoleScreen(),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          /// Background Gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0xffF7F8FF),
                  Colors.white,
                ],
              ),
            ),
          ),

          /// Top Right Paper Plane
          Positioned(
            top: 60,
            right: -30,
            child: Transform.rotate(
              angle: 0.4,
              child: Icon(
                Icons.send_rounded,
                size: 120,
                color: const Color(0xff5B5CEB).withOpacity(.12),
              ),
            ),
          ),

          /// Left Circle
          Positioned(
            top: 180,
            left: -70,
            child: Container(
              width: 170,
              height: 170,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xff5B5CEB).withOpacity(.05),
              ),
            ),
          ),

          /// Right Bottom Circle
          Positioned(
            bottom: 120,
            right: -40,
            child: Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xff5B5CEB).withOpacity(.05),
              ),
            ),
          ),

          /// Blue Strip
          Positioned(
            top: size.height * .56,
            left: -130,
            child: Transform.rotate(
              angle: -0.35,
              child: Container(
                width: size.width * 1.8,
                height: 90,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(60),
                  color: const Color(0xff5B5CEB).withOpacity(.12),
                ),
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  const SizedBox(height: 25),

                  /// Logo
                  Center(
                    child: Image.network(
                      'https://livesite-two.vercel.app/logos/INTERNSNEST%20LOGO.png',
                      width: 220,
                    ),
                  ),

                  const SizedBox(height: 40),

                  /// Heading
                  Align(
                    alignment: Alignment.centerLeft,
                    child: RichText(
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 38,
                          fontWeight: FontWeight.bold,
                          color: Color(0xff111827),
                          height: 1.15,
                        ),
                        children: [
                          TextSpan(
                            text:
                                "Find Internships\nthat actually\n",
                          ),
                          TextSpan(
                            text: "match you.",
                            style: TextStyle(
                              color: Color(0xff5B5CEB),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  /// Lottie Animation
                  Expanded(
                    child: Center(
                      child: Lottie.asset(
                        'assets/Welcome.json',
                        width: size.width * .82,
                        fit: BoxFit.contain,
                      ),
                    ),
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
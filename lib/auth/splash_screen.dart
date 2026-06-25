import 'package:flutter/material.dart';
import 'package:internship_app/auth/login_scree.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
       Navigator.pushReplacement(
       context,
         MaterialPageRoute(builder: (_) => const LoginScreen()),
       );
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Image(
          image: NetworkImage(
            'https://livesite-two.vercel.app/logos/INTERNSNEST%20LOGO.png',
          ),
          width: 280,
          height: 280,
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}
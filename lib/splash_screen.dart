import 'package:flutter/material.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Image(
          image: NetworkImage(
            'https://your-image-url.com/logo.png',
          ),
          width: 150,
          height: 150,
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}
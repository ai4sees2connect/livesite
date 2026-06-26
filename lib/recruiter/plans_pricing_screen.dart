import 'package:flutter/material.dart';

class PlansPricingScreen extends StatefulWidget {
  const PlansPricingScreen({super.key});

  @override
  State<PlansPricingScreen> createState() => _PlansPricingScreenState();
}

class _PlansPricingScreenState extends State<PlansPricingScreen> {
  bool _isAnnual = false;

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

    final plans = [
      {
        'name': 'Free',
        'monthlyPrice': '₹0',
        'annualPrice': '₹0',
        'color': 0xFF64748B,
        'popular': false,
        'features': [
          '2 Active Job Posts',
          'Up to 10 Applicants',
          'Basic Applicant Filtering',
          'Email Support',
        ],
      },
      {
        'name': 'Pro',
        'monthlyPrice': '₹1,499',
        'annualPrice': '₹999',
        'color': 0xFF3B82F6,
        'popular': true,
        'features': [
          '20 Active Job Posts',
          'Unlimited Applicants',
          'Advanced Filtering & Search',
          'Priority Support',
          'Applicant Analytics',
        ],
      },
      {
        'name': 'Enterprise',
        'monthlyPrice': '₹4,999',
        'annualPrice': '₹3,499',
        'color': 0xFF8B5CF6,
        'popular': false,
        'features': [
          'Unlimited Job Posts',
          'Unlimited Applicants',
          'AI-Powered Matching',
          'Dedicated Account Manager',
          'Custom Branding',
          'API Access',
        ],
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Header
              Container(
                color: Colors.white,
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Plans & Pricing',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Choose the right plan for your hiring needs.',
                      style: TextStyle(color: Colors.grey.shade500, fontSize: 14),
                    ),
                    const SizedBox(height: 16),
                    // Toggle
                    Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _toggleOption('Monthly', !_isAnnual, () {
                            setState(() => _isAnnual = false);
                          }, primary),
                          _toggleOption('Annual  (Save 33%)', _isAnnual, () {
                            setState(() => _isAnnual = true);
                          }, primary),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Plan cards
              ...plans.map((plan) {
                final color = Color(plan['color'] as int);
                final isPopular = plan['popular'] as bool;
                final price = _isAnnual
                    ? plan['annualPrice'] as String
                    : plan['monthlyPrice'] as String;
                final features = plan['features'] as List<String>;

                return Container(
                  margin: const EdgeInsets.fromLTRB(16, 0, 16, 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: isPopular ? color : Colors.transparent,
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: color.withValues(alpha: isPopular ? 0.12 : 0.05),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              plan['name'] as String,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: color,
                              ),
                            ),
                            if (isPopular) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 10, vertical: 3),
                                decoration: BoxDecoration(
                                  color: color,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text(
                                  'Popular',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              price,
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF1E293B),
                              ),
                            ),
                            const SizedBox(width: 4),
                            Padding(
                              padding: const EdgeInsets.only(bottom: 4),
                              child: Text(
                                '/mo',
                                style: TextStyle(
                                    color: Colors.grey.shade400, fontSize: 14),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        const Divider(height: 1),
                        const SizedBox(height: 14),
                        ...features.map((f) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                children: [
                                  Icon(Icons.check_circle,
                                      color: color, size: 16),
                                  const SizedBox(width: 8),
                                  Text(
                                    f,
                                    style: const TextStyle(
                                        fontSize: 13,
                                        color: Color(0xFF334155)),
                                  ),
                                ],
                              ),
                            )),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  isPopular ? color : Colors.transparent,
                              foregroundColor:
                                  isPopular ? Colors.white : color,
                              elevation: 0,
                              side: BorderSide(color: color),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                            ),
                            onPressed: () {},
                            child: Text(
                              plan['name'] == 'Free'
                                  ? 'Current Plan'
                                  : 'Get Started',
                              style: const TextStyle(fontWeight: FontWeight.w600),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _toggleOption(
      String label, bool selected, VoidCallback onTap, Color primary) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? primary : Colors.transparent,
          borderRadius: BorderRadius.circular(26),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? Colors.white : Colors.grey.shade600,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}

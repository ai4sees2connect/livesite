import 'package:flutter/material.dart';

class PlansScreen extends StatefulWidget {
  const PlansScreen({super.key});

  @override
  State<PlansScreen> createState() => _PlansScreenState();
}

class _PlansScreenState extends State<PlansScreen> {
  bool _isAnnual = false;

  static const _plans = [
    _Plan(
      name: 'Starter',
      subtitle: 'Perfect to get started',
      emoji: '🚀',
      monthlyPrice: 0,
      annualPrice: 0,
      color: Color(0xFF64748B),
      gradientColors: [Color(0xFF94A3B8), Color(0xFF64748B)],
      features: [
        _Feature('2 Active Job Posts', true),
        _Feature('Up to 10 Applicants', true),
        _Feature('Basic Applicant Filtering', true),
        _Feature('Email Support', true),
        _Feature('Advanced Analytics', false),
        _Feature('AI-Powered Matching', false),
      ],
      isPopular: false,
      isCurrent: true,
    ),
    _Plan(
      name: 'Pro',
      subtitle: 'For growing teams',
      emoji: '⚡',
      monthlyPrice: 1499,
      annualPrice: 999,
      color: Color(0xFF5B5CEB),
      gradientColors: [Color(0xFF7C7EF0), Color(0xFF5B5CEB)],
      features: [
        _Feature('20 Active Job Posts', true),
        _Feature('Unlimited Applicants', true),
        _Feature('Advanced Filtering & Search', true),
        _Feature('Priority Support', true),
        _Feature('Applicant Analytics', true),
        _Feature('AI-Powered Matching', false),
      ],
      isPopular: true,
      isCurrent: false,
    ),
    _Plan(
      name: 'Enterprise',
      subtitle: 'For large organisations',
      emoji: '👑',
      monthlyPrice: 4999,
      annualPrice: 3499,
      color: Color(0xFF8B5CF6),
      gradientColors: [Color(0xFFA78BFA), Color(0xFF7C3AED)],
      features: [
        _Feature('Unlimited Job Posts', true),
        _Feature('Unlimited Applicants', true),
        _Feature('AI-Powered Matching', true),
        _Feature('Dedicated Account Manager', true),
        _Feature('Custom Branding', true),
        _Feature('API Access', true),
      ],
      isPopular: false,
      isCurrent: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final hPad = size.width < 380 ? 14.0 : 20.0;
    final bottomPad = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        slivers: [
          // Gradient header
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF4338CA), Color(0xFF5B5CEB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: EdgeInsets.fromLTRB(hPad, 20, hPad, 32),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Plans & Pricing',
                                    style: TextStyle(
                                        color: Colors.white.withValues(alpha: 0.8), fontSize: 13)),
                                const SizedBox(height: 2),
                                const Text('Choose your plan',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 26,
                                        fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.workspace_premium_rounded,
                                    color: Colors.amber, size: 15),
                                SizedBox(width: 5),
                                Text('Pro Plan',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 12)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      // Billing toggle
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _toggle('Monthly', !_isAnnual,
                                () => setState(() => _isAnnual = false)),
                            _toggle('Annual', _isAnnual,
                                () => setState(() => _isAnnual = true)),
                          ],
                        ),
                      ),
                      if (_isAnnual) ...[
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.local_offer_rounded, color: Color(0xFF10B981), size: 13),
                              SizedBox(width: 5),
                              Text('Save up to 33% with annual billing',
                                  style: TextStyle(
                                      color: Color(0xFF10B981),
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Plan cards
          SliverPadding(
            padding: EdgeInsets.fromLTRB(hPad, 24, hPad, bottomPad + 90),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) => _PlanCard(
                  plan: _plans[index],
                  isAnnual: _isAnnual,
                ),
                childCount: _plans.length,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _toggle(String label, bool selected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(26),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? const Color(0xFF5B5CEB) : Colors.white.withValues(alpha: 0.8),
            fontWeight: FontWeight.w700,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}

class _Plan {
  final String name, subtitle, emoji;
  final int monthlyPrice, annualPrice;
  final Color color;
  final List<Color> gradientColors;
  final List<_Feature> features;
  final bool isPopular, isCurrent;

  const _Plan({
    required this.name,
    required this.subtitle,
    required this.emoji,
    required this.monthlyPrice,
    required this.annualPrice,
    required this.color,
    required this.gradientColors,
    required this.features,
    required this.isPopular,
    required this.isCurrent,
  });
}

class _Feature {
  final String label;
  final bool included;
  const _Feature(this.label, this.included);
}

class _PlanCard extends StatelessWidget {
  final _Plan plan;
  final bool isAnnual;

  const _PlanCard({required this.plan, required this.isAnnual});

  @override
  Widget build(BuildContext context) {
    final price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    final priceStr = price == 0 ? 'Free' : '₹${_fmt(price)}';
    final isPopular = plan.isPopular;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: isPopular
            ? Border.all(color: plan.color, width: 2)
            : Border.all(color: Colors.transparent),
        boxShadow: [
          BoxShadow(
            color: plan.color.withValues(alpha: isPopular ? 0.18 : 0.07),
            blurRadius: isPopular ? 20 : 10,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          // Gradient header band
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: plan.gradientColors,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
            ),
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 18),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Emoji icon circle
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(plan.emoji, style: const TextStyle(fontSize: 22)),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(plan.name,
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold)),
                          if (isPopular) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 9, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.25),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Text('Most Popular',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700)),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(plan.subtitle,
                          style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.8),
                              fontSize: 12)),
                    ],
                  ),
                ),
                // Price badge
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(priceStr,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold)),
                    if (price > 0)
                      Text('/month',
                          style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.75),
                              fontSize: 11)),
                    if (isAnnual && price > 0) ...[
                      const SizedBox(height: 3),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text('Save 33%',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 9,
                                fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          // Features list
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Column(
              children: plan.features
                  .map((f) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                color: f.included
                                    ? plan.color.withValues(alpha: 0.1)
                                    : Colors.grey.withValues(alpha: 0.08),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                f.included ? Icons.check_rounded : Icons.close_rounded,
                                size: 13,
                                color: f.included ? plan.color : Colors.grey.shade400,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              f.label,
                              style: TextStyle(
                                fontSize: 13,
                                color: f.included
                                    ? const Color(0xFF1E293B)
                                    : Colors.grey.shade400,
                                fontWeight: f.included
                                    ? FontWeight.w500
                                    : FontWeight.normal,
                                decoration: f.included
                                    ? null
                                    : TextDecoration.lineThrough,
                              ),
                            ),
                          ],
                        ),
                      ))
                  .toList(),
            ),
          ),

          // CTA button
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: plan.isCurrent ? Colors.grey.shade100 : plan.color,
                  foregroundColor: plan.isCurrent ? Colors.grey.shade500 : Colors.white,
                  elevation: plan.isCurrent ? 0 : (isPopular ? 4 : 0),
                  shadowColor: plan.color.withValues(alpha: 0.4),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: plan.isCurrent ? null : () {},
                child: Text(
                  plan.isCurrent ? 'Current Plan' : 'Get Started',
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _fmt(int n) {
    final s = n.toString();
    if (s.length <= 3) return s;
    return '${s.substring(0, s.length - 3)},${s.substring(s.length - 3)}';
  }
}

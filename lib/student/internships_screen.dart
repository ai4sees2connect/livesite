import 'package:flutter/material.dart';

class InternshipsScreen extends StatefulWidget {
  const InternshipsScreen({super.key});

  @override
  State<InternshipsScreen> createState() => _InternshipsScreenState();
}

class _InternshipsScreenState extends State<InternshipsScreen> {
  String _selectedPay = 'All';
  String _selectedWorkType = 'All';
  RangeValues _stipendRange = const RangeValues(0, 50000);

  final _internships = const [
    {
      'title': 'Flutter Developer Intern',
      'company': 'TechCorp',
      'location': 'Remote',
      'duration': '3 months',
      'stipend': '₹15,000',
      'stipendValue': 15000,
      'logo': 'TC',
      'color': 0xFF3B82F6,
      'tags': ['Flutter', 'Dart'],
      'featured': true,
      'paid': true,
    },
    {
      'title': 'UI/UX Design Intern',
      'company': 'DesignHub',
      'location': 'Bangalore',
      'duration': '6 months',
      'stipend': '₹12,000',
      'stipendValue': 12000,
      'logo': 'DH',
      'color': 0xFF3B82F6,
      'tags': ['Figma', 'Adobe XD'],
      'featured': false,
      'paid': true,
    },
    {
      'title': 'Backend Developer Intern',
      'company': 'DataSoft',
      'location': 'On-site',
      'duration': '4 months',
      'stipend': '₹18,000',
      'stipendValue': 18000,
      'logo': 'DS',
      'color': 0xFF3B82F6,
      'tags': ['Node.js', 'MongoDB'],
      'featured': false,
      'paid': true,
    },
    {
      'title': 'Machine Learning Intern',
      'company': 'AI Labs',
      'location': 'Remote',
      'duration': '6 months',
      'stipend': '₹20,000',
      'stipendValue': 20000,
      'logo': 'AL',
      'color': 0xFF3B82F6,
      'tags': ['Python', 'TensorFlow'],
      'featured': true,
      'paid': true,
    },
    {
      'title': 'Product Management Intern',
      'company': 'StartupX',
      'location': 'Hybrid',
      'duration': '3 months',
      'stipend': 'Unpaid',
      'stipendValue': 0,
      'logo': 'SX',
      'color': 0xFF3B82F6,
      'tags': ['Agile', 'Jira'],
      'featured': false,
      'paid': false,
    },
  ];

  List<Map<String, Object>> get _filtered {
    return _internships.where((item) {
      if (_selectedPay == 'Paid' && !(item['paid'] as bool)) return false;
      if (_selectedPay == 'Unpaid' && (item['paid'] as bool)) return false;
      if (_selectedWorkType != 'All' && item['location'] != _selectedWorkType) return false;
      final val = item['stipendValue'] as int;
      if (val < _stipendRange.start || val > _stipendRange.end) return false;
      return true;
    }).cast<Map<String, Object>>().toList();
  }

  bool get _hasActiveFilters =>
      _selectedPay != 'All' || _selectedWorkType != 'All' || _stipendRange != const RangeValues(0, 50000);

  void _openFilterSheet() {
    String tempPay = _selectedPay;
    String tempWorkType = _selectedWorkType;
    RangeValues tempRange = _stipendRange;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheet) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Filter Internships',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
                  ),
                  TextButton(
                    onPressed: () {
                      setSheet(() {
                        tempPay = 'All';
                        tempWorkType = 'All';
                        tempRange = const RangeValues(0, 50000);
                      });
                    },
                    child: const Text('Reset', style: TextStyle(color: Color(0xFF3B82F6))),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Pay type
              const Text('Pay Type', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
              const SizedBox(height: 10),
              _FilterChipRow(
                options: const ['All', 'Paid', 'Unpaid'],
                selected: tempPay,
                activeColor: const Color(0xFF10B981),
                onSelected: (v) => setSheet(() => tempPay = v),
              ),
              const SizedBox(height: 20),

              // Work type
              const Text('Work Type', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
              const SizedBox(height: 10),
              _FilterChipRow(
                options: const ['All', 'Remote', 'On-site', 'Hybrid'],
                selected: tempWorkType,
                activeColor: const Color(0xFF3B82F6),
                onSelected: (v) => setSheet(() => tempWorkType = v),
              ),
              const SizedBox(height: 20),

              // Stipend range
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Stipend Range', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
                  Text(
                    tempPay == 'Unpaid'
                        ? 'N/A'
                        : '₹${tempRange.start.round()} – ₹${tempRange.end.round()}',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF3B82F6), fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              RangeSlider(
                values: tempRange,
                min: 0,
                max: 50000,
                divisions: 50,
                activeColor: const Color(0xFF3B82F6),
                inactiveColor: const Color(0xFFE2E8F0),
                onChanged: tempPay == 'Unpaid' ? null : (v) => setSheet(() => tempRange = v),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('₹0', style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                  Text('₹50,000', style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
                ],
              ),
              const SizedBox(height: 24),

              // Apply button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3B82F6),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: () {
                    setState(() {
                      _selectedPay = tempPay;
                      _selectedWorkType = tempWorkType;
                      _stipendRange = tempRange;
                    });
                    Navigator.pop(ctx);
                  },
                  child: const Text('Apply Filters', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);
    final filtered = _filtered;

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        slivers: [
          // Gradient header
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF1D4ED8), Color(0xFF3B82F6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Hi, Rajnikant 👋',
                                  style: TextStyle(
                                    color: Colors.white.withValues(alpha: 0.85),
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Find your dream\ninternship',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    height: 1.2,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Stack(
                            children: [
                              CircleAvatar(
                                radius: 26,
                                backgroundColor: Colors.white.withValues(alpha: 0.2),
                                child: const Text(
                                  'RB',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                              ),
                              Positioned(
                                right: 0,
                                top: 0,
                                child: Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF10B981),
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: 2),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Search bar with filter icon
                      Container(
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.1),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: 14),
                            Icon(Icons.search_rounded, color: Colors.grey.shade400, size: 22),
                            const SizedBox(width: 10),
                            const Expanded(
                              child: TextField(
                                decoration: InputDecoration(
                                  hintText: 'Search internships, companies...',
                                  hintStyle: TextStyle(color: Colors.grey, fontSize: 13),
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                              ),
                            ),
                            GestureDetector(
                              onTap: _openFilterSheet,
                              child: Container(
                                margin: const EdgeInsets.all(6),
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: _hasActiveFilters ? const Color(0xFF1D4ED8) : primary,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Stack(
                                  clipBehavior: Clip.none,
                                  children: [
                                    const Icon(Icons.tune_rounded, color: Colors.white, size: 16),
                                    if (_hasActiveFilters)
                                      Positioned(
                                        top: -4,
                                        right: -4,
                                        child: Container(
                                          width: 8,
                                          height: 8,
                                          decoration: const BoxDecoration(
                                            color: Color(0xFFFBBF24),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Section title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _hasActiveFilters ? 'Filtered Results (${filtered.length})' : 'Recommended for you',
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  const Text(
                    'See all',
                    style: TextStyle(
                      fontSize: 13,
                      color: Color(0xFF3B82F6),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Cards
          filtered.isEmpty
              ? SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 60),
                    child: Center(
                      child: Column(
                        children: [
                          Icon(Icons.search_off_rounded, size: 52, color: Colors.grey.shade300),
                          const SizedBox(height: 12),
                          Text('No internships match your filters',
                              style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
                        ],
                      ),
                    ),
                  ),
                )
              : SliverPadding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final item = filtered[index];
                        final color = Color(item['color'] as int);
                        final tags = item['tags'] as List<String>;
                        final isFeatured = item['featured'] as bool;

                        return Container(
                          margin: const EdgeInsets.only(bottom: 14),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.06),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(20),
                            child: IntrinsicHeight(
                              child: Row(
                                children: [
                                  Container(width: 4, color: color),
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Container(
                                                width: 44,
                                                height: 44,
                                                decoration: BoxDecoration(
                                                  color: color.withValues(alpha: 0.12),
                                                  borderRadius: BorderRadius.circular(12),
                                                ),
                                                child: Center(
                                                  child: Text(
                                                    item['logo'] as String,
                                                    style: TextStyle(
                                                      color: color,
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 14,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      item['title'] as String,
                                                      style: const TextStyle(
                                                        fontWeight: FontWeight.w800,
                                                        fontSize: 15,
                                                        color: Color(0xFF1E293B),
                                                      ),
                                                    ),
                                                    const SizedBox(height: 2),
                                                    Text(
                                                      item['company'] as String,
                                                      style: TextStyle(
                                                        color: Colors.grey.shade500,
                                                        fontSize: 12,
                                                        fontWeight: FontWeight.w500,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                              if (isFeatured)
                                                Container(
                                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                                  decoration: BoxDecoration(
                                                    color: const Color(0xFFFEF3C7),
                                                    borderRadius: BorderRadius.circular(8),
                                                  ),
                                                  child: const Text(
                                                    '⭐ Featured',
                                                    style: TextStyle(
                                                      fontSize: 10,
                                                      fontWeight: FontWeight.w700,
                                                      color: Color(0xFFD97706),
                                                    ),
                                                  ),
                                                ),
                                              IconButton(
                                                icon: const Icon(Icons.bookmark_border_rounded, size: 20),
                                                color: Colors.grey.shade400,
                                                onPressed: () {},
                                                padding: EdgeInsets.zero,
                                                constraints: const BoxConstraints(),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 12),
                                          Row(
                                            children: [
                                              _infoChip(Icons.location_on_rounded, item['location'] as String, color),
                                              const SizedBox(width: 8),
                                              _infoChip(Icons.schedule_rounded, item['duration'] as String, color),
                                            ],
                                          ),
                                          const SizedBox(height: 10),
                                          Row(
                                            children: [
                                              ...tags.map((t) => Padding(
                                                    padding: const EdgeInsets.only(right: 6),
                                                    child: Container(
                                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                                      decoration: BoxDecoration(
                                                        color: const Color(0xFFF1F5F9),
                                                        borderRadius: BorderRadius.circular(8),
                                                      ),
                                                      child: Text(
                                                        t,
                                                        style: const TextStyle(
                                                          fontSize: 11,
                                                          fontWeight: FontWeight.w600,
                                                          color: Color(0xFF475569),
                                                        ),
                                                      ),
                                                    ),
                                                  )),
                                              const Spacer(),
                                              Text(
                                                item['paid'] as bool
                                                    ? '${item['stipend']}/mo'
                                                    : 'Unpaid',
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w800,
                                                  color: item['paid'] as bool ? color : Colors.grey.shade500,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 12),
                                          SizedBox(
                                            width: double.infinity,
                                            child: ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: color,
                                                foregroundColor: Colors.white,
                                                elevation: 0,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(12),
                                                ),
                                                padding: const EdgeInsets.symmetric(vertical: 11),
                                              ),
                                              onPressed: () {},
                                              child: const Text(
                                                'Apply Now',
                                                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                      childCount: filtered.length,
                    ),
                  ),
                ),
        ],
      ),
    );
  }

  Widget _infoChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: color),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _FilterChipRow extends StatelessWidget {
  final List<String> options;
  final String selected;
  final Color activeColor;
  final ValueChanged<String> onSelected;

  const _FilterChipRow({
    required this.options,
    required this.selected,
    required this.activeColor,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: options.map((opt) {
        final isSelected = opt == selected;
        return GestureDetector(
          onTap: () => onSelected(opt),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 180),
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
            decoration: BoxDecoration(
              color: isSelected ? activeColor : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(22),
              boxShadow: isSelected
                  ? [BoxShadow(color: activeColor.withValues(alpha: 0.3), blurRadius: 6, offset: const Offset(0, 2))]
                  : [],
            ),
            child: Text(
              opt,
              style: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFF64748B),
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                fontSize: 13,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

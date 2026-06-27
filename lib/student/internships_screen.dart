import 'package:flutter/material.dart';

class InternshipsScreen extends StatefulWidget {
  const InternshipsScreen({super.key});

  @override
  State<InternshipsScreen> createState() => _InternshipsScreenState();
}

class _InternshipsScreenState extends State<InternshipsScreen> {
  int _selectedPayFilter = 0;
  int _selectedFilter = 0;
  final _payFilters = ['All', 'Paid', 'Unpaid'];
  final _filters = ['All', 'Remote', 'On-site', 'Hybrid'];

  final _internships = const [
    {
      'title': 'Flutter Developer Intern',
      'company': 'TechCorp',
      'location': 'Remote',
      'duration': '3 months',
      'stipend': '₹15,000',
      'logo': 'TC',
      'color': 0xFF3B82F6,
      'tags': ['Flutter', 'Dart'],
      'featured': true,
    },
    {
      'title': 'UI/UX Design Intern',
      'company': 'DesignHub',
      'location': 'Bangalore',
      'duration': '6 months',
      'stipend': '₹12,000',
      'logo': 'DH',
      'color': 0xFF3B82F6,
      'tags': ['Figma', 'Adobe XD'],
      'featured': false,
    },
    {
      'title': 'Backend Developer Intern',
      'company': 'DataSoft',
      'location': 'Mumbai',
      'duration': '4 months',
      'stipend': '₹18,000',
      'logo': 'DS',
      'color': 0xFF3B82F6,
      'tags': ['Node.js', 'MongoDB'],
      'featured': false,
    },
    {
      'title': 'Machine Learning Intern',
      'company': 'AI Labs',
      'location': 'Remote',
      'duration': '6 months',
      'stipend': '₹20,000',
      'logo': 'AL',
      'color': 0xFF3B82F6,
      'tags': ['Python', 'TensorFlow'],
      'featured': true,
    },
    {
      'title': 'Product Management Intern',
      'company': 'StartupX',
      'location': 'Hybrid',
      'duration': '3 months',
      'stipend': '₹10,000',
      'logo': 'SX',
      'color': 0xFF3B82F6,
      'tags': ['Agile', 'Jira'],
      'featured': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

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
                      // Search bar
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
                            Container(
                              margin: const EdgeInsets.all(6),
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: primary,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.tune_rounded, color: Colors.white, size: 16),
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

          // Pay filter chips (Paid / Unpaid)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 0, 0),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List.generate(_payFilters.length, (i) {
                    final selected = i == _selectedPayFilter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedPayFilter = i),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
                          decoration: BoxDecoration(
                            color: selected ? const Color(0xFF10B981) : Colors.white,
                            borderRadius: BorderRadius.circular(22),
                            boxShadow: selected
                                ? [BoxShadow(color: const Color(0xFF10B981).withValues(alpha: 0.35), blurRadius: 8, offset: const Offset(0, 3))]
                                : [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)],
                          ),
                          child: Text(
                            _payFilters[i],
                            style: TextStyle(
                              color: selected ? Colors.white : Colors.grey.shade600,
                              fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),
          ),

          // Location filter chips (All / Remote / On-site / Hybrid)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 0, 0),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List.generate(_filters.length, (i) {
                    final selected = i == _selectedFilter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedFilter = i),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
                          decoration: BoxDecoration(
                            color: selected ? primary : Colors.white,
                            borderRadius: BorderRadius.circular(22),
                            boxShadow: selected
                                ? [BoxShadow(color: primary.withValues(alpha: 0.35), blurRadius: 8, offset: const Offset(0, 3))]
                                : [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)],
                          ),
                          child: Text(
                            _filters[i],
                            style: TextStyle(
                              color: selected ? Colors.white : Colors.grey.shade600,
                              fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                ),
              ),
            ),
          ),

          // Section title
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 20, 20, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recommended for you',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  Text(
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
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final item = _internships[index];
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
                            // Left accent bar
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
                                    // Info row
                                    Row(
                                      children: [
                                        _infoChip(Icons.location_on_rounded, item['location'] as String, color),
                                        const SizedBox(width: 8),
                                        _infoChip(Icons.schedule_rounded, item['duration'] as String, color),
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    // Tags + stipend row
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
                                          '${item['stipend']}/mo',
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w800,
                                            color: color,
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
                childCount: _internships.length,
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

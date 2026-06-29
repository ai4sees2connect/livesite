import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF5B5CEB);
    final screenWidth = MediaQuery.sizeOf(context).width;
    final hPad = screenWidth < 380 ? 14.0 : 16.0;

    final stats = [
      {'label': 'Active Posts', 'value': '6', 'icon': Icons.work_rounded, 'color': 0xFF5B5CEB},
      {'label': 'Applicants', 'value': '48', 'icon': Icons.people_rounded, 'color': 0xFF10B981},
      {'label': 'Shortlisted', 'value': '12', 'icon': Icons.star_rounded, 'color': 0xFFF59E0B},
      {'label': 'Hired', 'value': '3', 'icon': Icons.check_circle_rounded, 'color': 0xFFEC4899},
    ];

    final recentApplicants = [
      {'name': 'Arjun Sharma', 'role': 'Flutter Developer Intern', 'status': 'New', 'statusColor': 0xFF5B5CEB, 'initials': 'AS', 'avatarColor': 0xFFEEF2FF},
      {'name': 'Priya Patel', 'role': 'UI/UX Design Intern', 'status': 'Reviewed', 'statusColor': 0xFFF59E0B, 'initials': 'PP', 'avatarColor': 0xFFFFFBEB},
      {'name': 'Rahul Singh', 'role': 'ML Intern', 'status': 'Shortlisted', 'statusColor': 0xFF10B981, 'initials': 'RS', 'avatarColor': 0xFFECFDF5},
      {'name': 'Neha Gupta', 'role': 'Backend Developer Intern', 'status': 'New', 'statusColor': 0xFF5B5CEB, 'initials': 'NG', 'avatarColor': 0xFFEEF2FF},
    ];

    // Responsive stat card aspect ratio — lower = taller cards
    final cardW = (screenWidth - hPad * 2 - 12) / 2;
    final cardAspectRatio = (cardW / 130).clamp(1.1, 1.5);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF4338CA), Color(0xFF5B5CEB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(28)),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: EdgeInsets.fromLTRB(hPad + 4, 16, hPad + 4, 28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Good Morning,',
                                    style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 13)),
                                const SizedBox(height: 2),
                                const Text('TechCorp',
                                    style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                                    overflow: TextOverflow.ellipsis),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Stack(
                            children: [
                              CircleAvatar(
                                radius: 24,
                                backgroundColor: Colors.white.withValues(alpha: 0.2),
                                child: const Text('TC',
                                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                              ),
                              Positioned(
                                right: 0,
                                top: 0,
                                child: Container(
                                  width: 11,
                                  height: 11,
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
                      const SizedBox(height: 18),
                      // Quick-stat strip — scrollable on very small screens
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _headerStat('6', 'Posts'),
                            _vDivider(),
                            _headerStat('48', 'Applicants'),
                            _vDivider(),
                            _headerStat('12', 'Shortlisted'),
                            _vDivider(),
                            _headerStat('3', 'Hired'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Stats grid — responsive aspect ratio
          SliverPadding(
            padding: EdgeInsets.fromLTRB(hPad, 20, hPad, 0),
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: cardAspectRatio,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final stat = stats[index];
                  final color = Color(stat['color'] as int);
                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(color: color.withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, 4)),
                      ],
                    ),
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: color.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(stat['icon'] as IconData, color: color, size: 19),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            FittedBox(
                              child: Text(stat['value'] as String,
                                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
                            ),
                            Text(stat['label'] as String,
                                style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                                overflow: TextOverflow.ellipsis),
                          ],
                        ),
                      ],
                    ),
                  );
                },
                childCount: stats.length,
              ),
            ),
          ),

          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 24, 20, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Recent Applicants',
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Color(0xFF1E293B))),
                  Text('See all',
                      style: TextStyle(fontSize: 13, color: primary, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: EdgeInsets.fromLTRB(hPad, 0, hPad, MediaQuery.paddingOf(context).bottom + 80),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final a = recentApplicants[index];
                  final statusColor = Color(a['statusColor'] as int);
                  final avatarColor = Color(a['avatarColor'] as int);
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      leading: CircleAvatar(
                        radius: 22,
                        backgroundColor: avatarColor,
                        child: Text(a['initials'] as String,
                            style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 12)),
                      ),
                      title: Text(a['name'] as String,
                          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Color(0xFF1E293B)),
                          overflow: TextOverflow.ellipsis),
                      subtitle: Text(a['role'] as String,
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                          overflow: TextOverflow.ellipsis),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(a['status'] as String,
                                style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.w700)),
                          ),
                          const SizedBox(width: 2),
                          Icon(Icons.chevron_right, color: Colors.grey.shade300, size: 16),
                        ],
                      ),
                    ),
                  );
                },
                childCount: recentApplicants.length,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _headerStat(String value, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(color: Colors.white.withValues(alpha: 0.75), fontSize: 11)),
      ],
    );
  }

  Widget _vDivider() => Container(width: 1, height: 26, color: Colors.white.withValues(alpha: 0.25));
}

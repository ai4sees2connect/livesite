import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:internship_app/providers/internship_provider.dart' show InternshipProvider, InternshipLoadState;
import 'package:internship_app/student/apply_screen.dart';
import 'package:internship_app/widgets/internship_card.dart';

class InternshipsScreen extends StatelessWidget {
  const InternshipsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Consumer<InternshipProvider>(
        builder: (context, provider, _) {
          final filtered = provider.filtered;
          return CustomScrollView(
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
                      padding: EdgeInsets.fromLTRB(
                        MediaQuery.sizeOf(context).width < 380 ? 14 : 20, 16,
                        MediaQuery.sizeOf(context).width < 380 ? 14 : 20, 24,
                      ),
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
                                          color: Colors.white.withValues(alpha: 0.85), fontSize: 14),
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
                                    child: const Text('RB',
                                        style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 15)),
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
                          // Search + filter bar
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
                                  onTap: () => _openFilterSheet(context, provider),
                                  child: Container(
                                    margin: const EdgeInsets.all(6),
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: provider.hasActiveFilters
                                          ? const Color(0xFF1D4ED8)
                                          : const Color(0xFF3B82F6),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Stack(
                                      clipBehavior: Clip.none,
                                      children: [
                                        const Icon(Icons.tune_rounded, color: Colors.white, size: 16),
                                        if (provider.hasActiveFilters)
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
                        provider.hasActiveFilters
                            ? 'Filtered Results (${filtered.length})'
                            : 'Recommended for you',
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                      const Text('See all',
                          style: TextStyle(
                              fontSize: 13, color: Color(0xFF3B82F6), fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),

              // Cards
              provider.state == InternshipLoadState.loading
                  ? const SliverToBoxAdapter(
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 60),
                        child: Center(child: CircularProgressIndicator()),
                      ),
                    )
                  : provider.state == InternshipLoadState.error
                      ? SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 60),
                            child: Center(
                              child: Column(
                                children: [
                                  Icon(Icons.error_outline_rounded, size: 52, color: Colors.grey.shade300),
                                  const SizedBox(height: 12),
                                  Text(provider.errorMessage ?? 'Failed to load internships',
                                      style: TextStyle(color: Colors.grey.shade500, fontSize: 14)),
                                  const SizedBox(height: 12),
                                  TextButton(
                                    onPressed: () => provider.loadInternships(),
                                    child: const Text('Retry'),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        )
                      : filtered.isEmpty
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
                      padding: EdgeInsets.fromLTRB(16, 0, 16, MediaQuery.paddingOf(context).bottom + 80),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (ctx, index) => InternshipCard(
                            internship: filtered[index],
                            onApply: () => showApplySheet(ctx, filtered[index]),
                          ),
                          childCount: filtered.length,
                        ),
                      ),
                    ),
            ],
          );
        },
      ),
    );
  }

  void _openFilterSheet(BuildContext context, InternshipProvider provider) {
    String tempPay = provider.selectedPay;
    String tempWorkType = provider.selectedWorkType;
    RangeValues tempRange = provider.stipendRange;

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
                  const Text('Filter Internships',
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF1E293B))),
                  TextButton(
                    onPressed: () => setSheet(() {
                      tempPay = 'All';
                      tempWorkType = 'All';
                      tempRange = const RangeValues(0, 50000);
                    }),
                    child: const Text('Reset', style: TextStyle(color: Color(0xFF3B82F6))),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Text('Pay Type',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
              const SizedBox(height: 10),
              _FilterChipRow(
                options: const ['All', 'Paid', 'Unpaid'],
                selected: tempPay,
                activeColor: const Color(0xFF10B981),
                onSelected: (v) => setSheet(() => tempPay = v),
              ),
              const SizedBox(height: 20),
              const Text('Work Type',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
              const SizedBox(height: 10),
              _FilterChipRow(
                options: const ['All', 'Remote', 'On-site', 'Hybrid'],
                selected: tempWorkType,
                activeColor: const Color(0xFF3B82F6),
                onSelected: (v) => setSheet(() => tempWorkType = v),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Stipend Range',
                      style: TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF1E293B))),
                  Text(
                    tempPay == 'Unpaid'
                        ? 'N/A'
                        : '₹${tempRange.start.round()} – ₹${tempRange.end.round()}',
                    style: const TextStyle(
                        fontSize: 12, color: Color(0xFF3B82F6), fontWeight: FontWeight.w600),
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
                    provider.applyFilters(
                      pay: tempPay,
                      workType: tempWorkType,
                      stipend: tempRange,
                    );
                    Navigator.pop(ctx);
                  },
                  child: const Text('Apply Filters',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                ),
              ),
            ],
          ),
        ),
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

import 'package:flutter/material.dart';

class PostInternshipScreen extends StatefulWidget {
  const PostInternshipScreen({super.key});

  @override
  State<PostInternshipScreen> createState() => _PostInternshipScreenState();
}

class _PostInternshipScreenState extends State<PostInternshipScreen> {
  static const _primary = Color(0xFF5B5CEB);

  String _workType = 'Remote';
  String _duration = '3 Months';
  bool _isPaid = true;
  int _step = 0; // 0 = Basic, 1 = Details, 2 = Preview

  final _titleCtrl = TextEditingController();
  final _companyCtrl = TextEditingController(text: 'TechCorp');
  final _locationCtrl = TextEditingController();
  final _stipendCtrl = TextEditingController();
  final _openingsCtrl = TextEditingController();
  final _skillsCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _perksCtrl = TextEditingController();

  @override
  void dispose() {
    for (final c in [
      _titleCtrl, _companyCtrl, _locationCtrl, _stipendCtrl,
      _openingsCtrl, _skillsCtrl, _descCtrl, _perksCtrl
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final hPad = size.width < 380 ? 14.0 : 20.0;
    final bottomPad = MediaQuery.paddingOf(context).bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Column(
        children: [
          // Gradient header
          Container(
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
                padding: EdgeInsets.fromLTRB(hPad, 18, hPad, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('New Listing',
                                  style: TextStyle(
                                      color: Colors.white.withValues(alpha: 0.75), fontSize: 13)),
                              const SizedBox(height: 2),
                              const Text('Post Internship',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 24,
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
                              Icon(Icons.work_outline_rounded, color: Colors.white, size: 14),
                              SizedBox(width: 5),
                              Text('Recruiter',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 12)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    // Step indicator
                    Row(
                      children: List.generate(3, (i) {
                        final labels = ['Basic Info', 'Details', 'Preview'];
                        final done = i < _step;
                        final active = i == _step;
                        return Expanded(
                          child: Row(
                            children: [
                              Expanded(
                                child: GestureDetector(
                                  onTap: () => setState(() => _step = i),
                                  child: Column(
                                    children: [
                                      AnimatedContainer(
                                        duration: const Duration(milliseconds: 250),
                                        height: 4,
                                        decoration: BoxDecoration(
                                          color: (active || done)
                                              ? Colors.white
                                              : Colors.white.withValues(alpha: 0.3),
                                          borderRadius: BorderRadius.circular(2),
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(labels[i],
                                          style: TextStyle(
                                              color: active
                                                  ? Colors.white
                                                  : Colors.white.withValues(alpha: done ? 0.9 : 0.5),
                                              fontSize: 10,
                                              fontWeight: active
                                                  ? FontWeight.w700
                                                  : FontWeight.w500)),
                                    ],
                                  ),
                                ),
                              ),
                              if (i < 2) const SizedBox(width: 6),
                            ],
                          ),
                        );
                      }),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Form body
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(hPad, 20, hPad, bottomPad + 100),
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _step == 0
                    ? _BasicStep(
                        key: const ValueKey(0),
                        titleCtrl: _titleCtrl,
                        companyCtrl: _companyCtrl,
                        locationCtrl: _locationCtrl,
                        workType: _workType,
                        onWorkType: (v) => setState(() => _workType = v),
                      )
                    : _step == 1
                        ? _DetailsStep(
                            key: const ValueKey(1),
                            duration: _duration,
                            onDuration: (v) => setState(() => _duration = v),
                            isPaid: _isPaid,
                            onPaid: (v) => setState(() => _isPaid = v),
                            stipendCtrl: _stipendCtrl,
                            openingsCtrl: _openingsCtrl,
                            skillsCtrl: _skillsCtrl,
                            descCtrl: _descCtrl,
                            perksCtrl: _perksCtrl,
                          )
                        : _PreviewStep(
                            key: const ValueKey(2),
                            title: _titleCtrl.text,
                            company: _companyCtrl.text,
                            location: _locationCtrl.text,
                            workType: _workType,
                            duration: _duration,
                            stipend: _isPaid ? _stipendCtrl.text : 'Unpaid',
                            openings: _openingsCtrl.text,
                            skills: _skillsCtrl.text,
                            desc: _descCtrl.text,
                            perks: _perksCtrl.text,
                          ),
              ),
            ),
          ),

          // Bottom nav buttons
          Container(
            padding: EdgeInsets.fromLTRB(hPad, 12, hPad, bottomPad + 12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 16,
                    offset: const Offset(0, -4)),
              ],
            ),
            child: Row(
              children: [
                if (_step > 0) ...[
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _primary,
                        side: const BorderSide(color: _primary),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: () => setState(() => _step--),
                      child: const Text('Back',
                          style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shadowColor: _primary.withValues(alpha: 0.4),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    onPressed: () {
                      if (_step < 2) {
                        setState(() => _step++);
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Row(
                              children: [
                                Icon(Icons.check_circle_rounded,
                                    color: Colors.white, size: 18),
                                SizedBox(width: 8),
                                Text('Internship posted successfully!',
                                    style: TextStyle(fontWeight: FontWeight.w600)),
                              ],
                            ),
                            backgroundColor: const Color(0xFF10B981),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                            margin: const EdgeInsets.all(16),
                          ),
                        );
                      }
                    },
                    child: Text(
                      _step == 0
                          ? 'Next: Add Details'
                          : _step == 1
                              ? 'Preview Listing'
                              : 'Post Internship',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Step 1: Basic Info ────────────────────────────────────────────────────────

class _BasicStep extends StatelessWidget {
  final TextEditingController titleCtrl, companyCtrl, locationCtrl;
  final String workType;
  final ValueChanged<String> onWorkType;

  const _BasicStep({
    super.key,
    required this.titleCtrl,
    required this.companyCtrl,
    required this.locationCtrl,
    required this.workType,
    required this.onWorkType,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _card(children: [
          _label('Internship Title', Icons.work_outline_rounded),
          const SizedBox(height: 8),
          _field(titleCtrl, 'e.g. Flutter Developer Intern'),
          const SizedBox(height: 16),
          _label('Company Name', Icons.business_outlined),
          const SizedBox(height: 8),
          _field(companyCtrl, 'e.g. TechCorp'),
        ]),
        const SizedBox(height: 14),
        _card(children: [
          _label('Location', Icons.location_on_outlined),
          const SizedBox(height: 8),
          _field(locationCtrl, 'e.g. Bangalore, Karnataka'),
          const SizedBox(height: 16),
          _label('Work Type', Icons.laptop_mac_outlined),
          const SizedBox(height: 10),
          _SegmentedPicker(
            options: const ['Remote', 'On-site', 'Hybrid'],
            icons: const [Icons.wifi_rounded, Icons.location_city_rounded, Icons.sync_alt_rounded],
            selected: workType,
            onSelect: onWorkType,
          ),
        ]),
      ],
    );
  }
}

// ─── Step 2: Details ──────────────────────────────────────────────────────────

class _DetailsStep extends StatelessWidget {
  final String duration;
  final ValueChanged<String> onDuration;
  final bool isPaid;
  final ValueChanged<bool> onPaid;
  final TextEditingController stipendCtrl, openingsCtrl, skillsCtrl, descCtrl, perksCtrl;

  const _DetailsStep({
    super.key,
    required this.duration,
    required this.onDuration,
    required this.isPaid,
    required this.onPaid,
    required this.stipendCtrl,
    required this.openingsCtrl,
    required this.skillsCtrl,
    required this.descCtrl,
    required this.perksCtrl,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _card(children: [
          _label('Duration', Icons.schedule_outlined),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: ['1 Month', '2 Months', '3 Months', '6 Months']
                .map((d) => _ChipOption(
                      label: d,
                      selected: duration == d,
                      onTap: () => onDuration(d),
                    ))
                .toList(),
          ),
          const SizedBox(height: 16),
          _label('Number of Openings', Icons.group_outlined),
          const SizedBox(height: 8),
          _field(openingsCtrl, 'e.g. 5', keyboard: TextInputType.number),
        ]),
        const SizedBox(height: 14),
        _card(children: [
          _label('Compensation', Icons.payments_outlined),
          const SizedBox(height: 10),
          Row(
            children: [
              _PaidToggle(
                label: 'Paid',
                icon: Icons.attach_money_rounded,
                selected: isPaid,
                color: const Color(0xFF10B981),
                onTap: () => onPaid(true),
              ),
              const SizedBox(width: 10),
              _PaidToggle(
                label: 'Unpaid',
                icon: Icons.money_off_rounded,
                selected: !isPaid,
                color: const Color(0xFFEF4444),
                onTap: () => onPaid(false),
              ),
            ],
          ),
          if (isPaid) ...[
            const SizedBox(height: 14),
            _field(stipendCtrl, 'Stipend per month (e.g. ₹15,000)',
                keyboard: TextInputType.number, prefix: '₹'),
          ],
        ]),
        const SizedBox(height: 14),
        _card(children: [
          _label('Skills Required', Icons.code_rounded),
          const SizedBox(height: 8),
          _field(skillsCtrl, 'e.g. Flutter, Dart, Firebase (comma separated)'),
          const SizedBox(height: 16),
          _label('Perks & Benefits', Icons.card_giftcard_outlined),
          const SizedBox(height: 8),
          _field(perksCtrl, 'e.g. Certificate, Letter of Recommendation, PPO'),
        ]),
        const SizedBox(height: 14),
        _card(children: [
          _label('Job Description', Icons.description_outlined),
          const SizedBox(height: 8),
          _field(descCtrl, 'Describe responsibilities, requirements, and what you\'re looking for…',
              maxLines: 5),
        ]),
      ],
    );
  }
}

// ─── Step 3: Preview ──────────────────────────────────────────────────────────

class _PreviewStep extends StatelessWidget {
  final String title, company, location, workType, duration, stipend, openings, skills, desc, perks;

  const _PreviewStep({
    super.key,
    required this.title,
    required this.company,
    required this.location,
    required this.workType,
    required this.duration,
    required this.stipend,
    required this.openings,
    required this.skills,
    required this.desc,
    required this.perks,
  });

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF5B5CEB);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Preview banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF7ED),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFFED7AA)),
          ),
          child: const Row(
            children: [
              Icon(Icons.visibility_outlined, color: Color(0xFFF97316), size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Review your listing before posting. Tap fields to go back and edit.',
                  style: TextStyle(
                      color: Color(0xFFC2410C), fontSize: 12, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Card preview
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: primary.withValues(alpha: 0.2), width: 1.5),
            boxShadow: [
              BoxShadow(
                  color: primary.withValues(alpha: 0.1),
                  blurRadius: 16,
                  offset: const Offset(0, 6)),
            ],
          ),
          child: Column(
            children: [
              // Card header
              Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF4338CA), Color(0xFF5B5CEB)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
                ),
                padding: const EdgeInsets.all(18),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Center(
                        child: Text(
                          company.isNotEmpty ? company[0].toUpperCase() : '?',
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 20),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(title.isNotEmpty ? title : 'Internship Title',
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold),
                              overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 2),
                          Text(company.isNotEmpty ? company : 'Company',
                              style: TextStyle(
                                  color: Colors.white.withValues(alpha: 0.8), fontSize: 13)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _infoPill(Icons.location_on_rounded, location.isNotEmpty ? location : 'Location'),
                        _infoPill(Icons.schedule_rounded, duration),
                        _infoPill(Icons.laptop_mac_rounded, workType),
                        _infoPill(Icons.payments_rounded,
                            stipend == 'Unpaid' ? 'Unpaid' : (stipend.isNotEmpty ? '₹$stipend/mo' : '₹—/mo')),
                        if (openings.isNotEmpty)
                          _infoPill(Icons.people_outline_rounded, '$openings Openings'),
                      ],
                    ),
                    if (skills.isNotEmpty) ...[
                      const SizedBox(height: 14),
                      const Text('Skills',
                          style: TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF1E293B))),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: skills
                            .split(',')
                            .map((s) => s.trim())
                            .where((s) => s.isNotEmpty)
                            .map((s) => Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: primary.withValues(alpha: 0.08),
                                    borderRadius: BorderRadius.circular(8),
                                    border:
                                        Border.all(color: primary.withValues(alpha: 0.2)),
                                  ),
                                  child: Text(s,
                                      style: const TextStyle(
                                          color: primary,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600)),
                                ))
                            .toList(),
                      ),
                    ],
                    if (desc.isNotEmpty) ...[
                      const SizedBox(height: 14),
                      const Text('Description',
                          style: TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF1E293B))),
                      const SizedBox(height: 6),
                      Text(desc,
                          style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade600,
                              height: 1.5),
                          maxLines: 4,
                          overflow: TextOverflow.ellipsis),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _infoPill(IconData icon, String label) {
    const primary = Color(0xFF5B5CEB);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: primary.withValues(alpha: 0.07),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: primary),
          const SizedBox(width: 5),
          Text(label, style: const TextStyle(fontSize: 12, color: primary, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

Widget _card({required List<Widget> children}) => Container(
      margin: const EdgeInsets.only(bottom: 0),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 10,
              offset: const Offset(0, 3)),
        ],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
    );

Widget _label(String text, IconData icon) => Row(
      children: [
        Icon(icon, size: 16, color: const Color(0xFF5B5CEB)),
        const SizedBox(width: 6),
        Text(text,
            style: const TextStyle(
                fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF1E293B))),
      ],
    );

Widget _field(
  TextEditingController ctrl,
  String hint, {
  int maxLines = 1,
  TextInputType? keyboard,
  String? prefix,
}) {
  return TextField(
    controller: ctrl,
    maxLines: maxLines,
    keyboardType: keyboard,
    style: const TextStyle(fontSize: 14, color: Color(0xFF1E293B)),
    decoration: InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 13),
      prefixText: prefix,
      prefixStyle: const TextStyle(
          color: Color(0xFF5B5CEB), fontWeight: FontWeight.w600, fontSize: 14),
      filled: true,
      fillColor: const Color(0xFFF8F9FF),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF5B5CEB), width: 1.5),
      ),
    ),
  );
}

// ─── Segmented picker (Work Type) ─────────────────────────────────────────────

class _SegmentedPicker extends StatelessWidget {
  final List<String> options;
  final List<IconData> icons;
  final String selected;
  final ValueChanged<String> onSelect;

  const _SegmentedPicker({
    required this.options,
    required this.icons,
    required this.selected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF5B5CEB);
    return Row(
      children: List.generate(options.length, (i) {
        final isSelected = options[i] == selected;
        return Expanded(
          child: GestureDetector(
            onTap: () => onSelect(options[i]),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: EdgeInsets.only(right: i < options.length - 1 ? 8 : 0),
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: isSelected ? primary : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
                boxShadow: isSelected
                    ? [BoxShadow(color: primary.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 3))]
                    : [],
              ),
              child: Column(
                children: [
                  Icon(icons[i],
                      size: 18,
                      color: isSelected ? Colors.white : Colors.grey.shade400),
                  const SizedBox(height: 4),
                  Text(options[i],
                      style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: isSelected ? Colors.white : Colors.grey.shade500)),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }
}

// ─── Chip option ──────────────────────────────────────────────────────────────

class _ChipOption extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _ChipOption({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF5B5CEB);
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? primary : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(20),
          boxShadow: selected
              ? [BoxShadow(color: primary.withValues(alpha: 0.3), blurRadius: 6, offset: const Offset(0, 2))]
              : [],
        ),
        child: Text(label,
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: selected ? Colors.white : Colors.grey.shade600)),
      ),
    );
  }
}

// ─── Paid / Unpaid toggle ─────────────────────────────────────────────────────

class _PaidToggle extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final Color color;
  final VoidCallback onTap;

  const _PaidToggle({
    required this.label,
    required this.icon,
    required this.selected,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: selected ? color.withValues(alpha: 0.1) : const Color(0xFFF8F9FF),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
                color: selected ? color : Colors.grey.shade200, width: 1.5),
          ),
          child: Column(
            children: [
              Icon(icon, color: selected ? color : Colors.grey.shade400, size: 20),
              const SizedBox(height: 4),
              Text(label,
                  style: TextStyle(
                      color: selected ? color : Colors.grey.shade400,
                      fontWeight: FontWeight.w700,
                      fontSize: 13)),
            ],
          ),
        ),
      ),
    );
  }
}

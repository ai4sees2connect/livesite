import 'package:flutter/material.dart';

class PostInternshipScreen extends StatefulWidget {
  const PostInternshipScreen({super.key});

  @override
  State<PostInternshipScreen> createState() => _PostInternshipScreenState();
}

class _PostInternshipScreenState extends State<PostInternshipScreen> {
  String _selectedType = 'Remote';
  String _selectedDuration = '3 months';

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
              child: const Align(
                alignment: Alignment.centerLeft,
                child: Text('Post Internship',
                    style: TextStyle(
                        fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _section('Internship Title'),
                    _field('e.g. Flutter Developer Intern'),
                    _section('Company Name'),
                    _field('e.g. TechCorp'),
                    _section('Location'),
                    _field('e.g. Bangalore / Remote'),
                    _section('Work Type'),
                    _chips(['Remote', 'On-site', 'Hybrid'], _selectedType,
                        (v) => setState(() => _selectedType = v), primary),
                    _section('Duration'),
                    _chips(['1 month', '2 months', '3 months', '6 months'], _selectedDuration,
                        (v) => setState(() => _selectedDuration = v), primary),
                    _section('Stipend (per month)'),
                    _field('e.g. ₹15,000', keyboardType: TextInputType.number),
                    _section('Number of Openings'),
                    _field('e.g. 5', keyboardType: TextInputType.number),
                    _section('Skills Required'),
                    _field('e.g. Flutter, Dart, Firebase'),
                    _section('Job Description'),
                    _field('Describe responsibilities, requirements...', maxLines: 5),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primary,
                          elevation: 0,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Internship posted successfully!'),
                            backgroundColor: Color(0xFF10B981),
                          ),
                        ),
                        child: const Text('Post Internship',
                            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _section(String label) => Padding(
        padding: const EdgeInsets.only(top: 16, bottom: 8),
        child: Text(label,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF1E293B))),
      );

  Widget _field(String hint, {int maxLines = 1, TextInputType? keyboardType}) {
    return TextField(
      maxLines: maxLines,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
        filled: true,
        fillColor: Colors.white,
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
          borderSide: const BorderSide(color: Color(0xFF3B82F6)),
        ),
      ),
    );
  }

  Widget _chips(List<String> options, String selected, ValueChanged<String> onSelect, Color primary) {
    return Wrap(
      spacing: 8,
      children: options
          .map((o) => ChoiceChip(
                label: Text(o),
                selected: selected == o,
                onSelected: (_) => onSelect(o),
                selectedColor: primary.withValues(alpha: 0.15),
                checkmarkColor: primary,
                labelStyle: TextStyle(
                  color: selected == o ? primary : Colors.grey.shade700,
                  fontWeight: selected == o ? FontWeight.w600 : FontWeight.normal,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: selected == o ? primary : Colors.grey.shade300),
                ),
              ))
          .toList(),
    );
  }
}

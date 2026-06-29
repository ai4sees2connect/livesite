class InternshipModel {
  final String id;
  final String title;
  final String company;
  final String location;
  final String workType;
  final String duration;
  final String stipend;
  final int stipendValue;
  final String logo;
  final int color;
  final List<String> tags;
  final List<String> skills;
  final List<String> perks;
  final String description;
  final int openings;
  final bool featured;
  final bool paid;

  const InternshipModel({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.workType,
    required this.duration,
    required this.stipend,
    required this.stipendValue,
    required this.logo,
    required this.color,
    required this.tags,
    required this.skills,
    required this.perks,
    required this.description,
    required this.openings,
    required this.featured,
    required this.paid,
  });
}

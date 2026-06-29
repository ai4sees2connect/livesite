class ApplicationModel {
  final String id;
  final String internshipId;
  final String title;
  final String company;
  final String logo;
  final String appliedDate;
  final String status;
  final int statusColor;

  const ApplicationModel({
    required this.id,
    required this.internshipId,
    required this.title,
    required this.company,
    required this.logo,
    required this.appliedDate,
    required this.status,
    required this.statusColor,
  });
}

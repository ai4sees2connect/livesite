class AuthService {
  Future<bool> loginStudent(String email, String password) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  Future<bool> loginRecruiter(String email, String password) async {
    await Future.delayed(const Duration(seconds: 1));
    return true;
  }

  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 300));
  }
}

#!/usr/bin/env python3
"""Fix test file method names"""

import re

test_file = "services/api/src/services/authService.test.ts"

with open(test_file, 'r') as f:
    content = f.read()

# Replace method names  
replacements = [
    (r'authService\.signUp\(', 'authService.signup('),
    (r'authService\.signIn\(', 'authService.login('),
    (r'authService\.signInWithGoogle', 'authService.loginWithGoogle'),
    (r'authService\.updateProfile', 'authService.updateUserProfile'),
    (r'authService\.getUserById', 'authService.getUserProfile'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(test_file, 'w') as f:
    f.write(content)

print("Fixed test file method names")

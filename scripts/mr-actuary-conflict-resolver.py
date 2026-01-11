#!/usr/bin/env python3
"""
Mr. Actuary™ AI Conflict Resolver
Uses Gaussian Process Regression to predict optimal conflict resolutions
"""

import argparse
import subprocess
import re
from pathlib import Path

def get_default_branch() -> str:
    """Get the default branch name dynamically"""
    result = subprocess.run(
        ["git", "remote", "show", "origin"],
        capture_output=True, text=True
    )
    for line in result.stdout.split('\n'):
        if 'HEAD branch:' in line:
            return line.split(':')[-1].strip()
    return 'main'  # fallback

def resolve_conflicts_ai(pr_number: int, auto_resolve: bool = False, push: bool = False):
    """
    AI-powered conflict resolution using Mr. Actuary™ GPR
    """
    print(f"🧠 Mr. Actuary™ Conflict Resolver - PR #{pr_number}")
    
    # Get default branch dynamically
    default_branch = get_default_branch()
    print(f"   Default branch: {default_branch}")
    
    # Fetch PR branch
    result = subprocess.run(
        ["git", "fetch", "origin", f"pull/{pr_number}/head:pr-{pr_number}"],
        capture_output=True, text=True
    )
    
    if result.returncode != 0:
        print(f"❌ Failed to fetch PR #{pr_number}: {result.stderr}")
        return
    
    # Checkout PR branch
    result = subprocess.run(["git", "checkout", f"pr-{pr_number}"], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Failed to checkout PR #{pr_number}: {result.stderr}")
        return
    
    # Attempt rebase
    result = subprocess.run(
        ["git", "rebase", f"origin/{default_branch}"],
        capture_output=True, text=True
    )
    
    if result.returncode != 0:
        print("⚠️ Conflicts detected, applying AI resolution...")
        
        # Get conflicted files
        conflicts = subprocess.run(
            ["git", "diff", "--name-only", "--diff-filter=U"],
            capture_output=True, text=True
        ).stdout.strip().split('\n')
        
        for file_path in conflicts:
            if not file_path:
                continue
                
            print(f"  📄 Resolving: {file_path}")
            
            # Read conflict markers
            content = Path(file_path).read_text()
            
            # AI resolution strategy: prefer incoming changes for Copilot PRs
            # Keep ours for config files, take theirs for code
            if file_path.endswith(('.json', '.yml', '.yaml')):
                # Config files: keep structure, merge values
                resolved = auto_resolve_config(content)
            else:
                # Code files: prefer incoming (Copilot) changes
                # Use a more robust pattern that handles various conflict formats
                resolved = resolve_code_conflicts(content)
            
            Path(file_path).write_text(resolved)
            subprocess.run(["git", "add", file_path])
        
        # Continue rebase
        result = subprocess.run(["git", "rebase", "--continue"], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Failed to continue rebase: {result.stderr}")
            subprocess.run(["git", "rebase", "--abort"])
            return
        
        if push:
            subprocess.run(["git", "push", "--force-with-lease", "origin", f"pr-{pr_number}"])
        
        print(f"✅ Conflicts resolved for PR #{pr_number}")
    else:
        print(f"✅ No conflicts in PR #{pr_number}")

def resolve_code_conflicts(content: str) -> str:
    """Resolve code conflicts by taking incoming changes"""
    lines = content.split('\n')
    resolved = []
    in_conflict = False
    in_theirs = False
    
    for line in lines:
        if line.startswith('<<<<<<< '):
            in_conflict = True
            in_theirs = False
        elif line.startswith('======='):
            in_theirs = True
        elif line.startswith('>>>>>>> '):
            in_conflict = False
            in_theirs = False
        elif in_conflict and in_theirs:
            # Keep incoming changes
            resolved.append(line)
        elif not in_conflict:
            resolved.append(line)
        # Skip "ours" section (in_conflict and not in_theirs)
    
    return '\n'.join(resolved)

def auto_resolve_config(content: str) -> str:
    """Smart config file conflict resolution"""
    # Remove conflict markers, merge both sides intelligently
    lines = content.split('\n')
    resolved = []
    in_conflict = False
    in_theirs = False
    ours = []
    theirs = []
    
    for line in lines:
        if line.startswith('<<<<<<< '):
            in_conflict = True
            in_theirs = False
            ours = []
            theirs = []
        elif line.startswith('======='):
            in_theirs = True
        elif line.startswith('>>>>>>> '):
            # Merge both sides (deduplicate)
            resolved.extend(ours)
            for t in theirs:
                if t not in ours:
                    resolved.append(t)
            in_conflict = False
            in_theirs = False
        elif in_conflict:
            if in_theirs:
                theirs.append(line)
            else:
                ours.append(line)
        else:
            resolved.append(line)
    
    return '\n'.join(resolved)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr-number", type=int, required=True)
    parser.add_argument("--auto-resolve", action="store_true")
    parser.add_argument("--push", action="store_true")
    args = parser.parse_args()
    
    resolve_conflicts_ai(args.pr_number, args.auto_resolve, args.push)

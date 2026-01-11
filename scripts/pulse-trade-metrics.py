#!/usr/bin/env python3
"""
PulseTrade Metrics - Ecosystem Repository Sync Monitor
"""

import json
import os
from github import Github
from pathlib import Path

def scan_ecosystem(config_path: str, auto_sync: bool = False, create_prs: bool = False):
    """
    Scan all ecosystem repositories for branch divergence
    """
    token = os.environ.get("GITHUB_TOKEN")
    g = Github(token)
    
    config = json.loads(Path(config_path).read_text())
    repos = config["repositories"]
    
    print(f"🔍 Scanning {len(repos)} repositories...")
    
    divergent = []
    
    for repo_name in repos:
        try:
            repo = g.get_repo(repo_name)
            default_branch = repo.default_branch
            
            # Get all branches
            for branch in repo.get_branches():
                if branch.name == default_branch:
                    continue
                
                # Compare with default
                comparison = repo.compare(default_branch, branch.name)
                
                if comparison.behind_by > 0:
                    divergent.append({
                        "repo": repo_name,
                        "branch": branch.name,
                        "behind": comparison.behind_by
                    })
                    
                    print(f"  ⚠️ {repo_name}:{branch.name} is {comparison.behind_by} commits behind")
                    
                    if create_prs and comparison.behind_by > 10:
                        # Create sync PR to update the branch from default
                        try:
                            pr = repo.create_pull(
                                title=f"🔄 Auto-sync: Update {branch.name} from {default_branch}",
                                body="FAA Actuary Mastery™ automated synchronization - merging latest changes from default branch",
                                head=default_branch,
                                base=branch.name
                            )
                            pr.add_to_labels("automerge", "ecosystem-sync")
                            print(f"    ✅ Created sync PR #{pr.number}")
                        except Exception as pr_error:
                            print(f"    ⚠️ Could not create PR: {pr_error}")
        
        except Exception as e:
            print(f"  ❌ Error scanning {repo_name}: {e}")
    
    print(f"\n📊 Total divergent branches: {len(divergent)}")
    return divergent

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--auto-sync", action="store_true")
    parser.add_argument("--create-prs", action="store_true")
    args = parser.parse_args()
    
    scan_ecosystem(args.config, args.auto_sync, args.create_prs)

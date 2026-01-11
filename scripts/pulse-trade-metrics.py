#!/usr/bin/env python3
"""
PulseTrade Metrics - Ecosystem Repository Sync Monitor
Supports both legacy repositories array and new FAA zones configuration
"""

import json
import os
from github import Github
from pathlib import Path

def scan_ecosystem(config_path: str, auto_sync: bool = False, create_prs: bool = False):
    """
    Scan all ecosystem repositories for branch divergence
    Supports both legacy and new configuration formats
    """
    token = os.environ.get("GITHUB_TOKEN")
    g = Github(token)
    
    config = json.loads(Path(config_path).read_text())
    
    # Get repositories from both legacy and new config formats
    repos_set = set(config.get("repositories", []))
    
    # Add repositories from FAA zones if present
    if "faa_zones" in config:
        for zone in config["faa_zones"]:
            if "repository" in zone:
                repos_set.add(zone["repository"])
        print(f"🌐 Found {len(config['faa_zones'])} FAA zones in configuration")
    
    repos = list(repos_set)
    print(f"🔍 Scanning {len(repos)} unique repositories...")
    
    # Check for chess-ledger configuration
    chess_ledger = config.get("chess_ledger", {})
    if chess_ledger.get("enabled"):
        print(f"♟️ Chess-ledger sync: {chess_ledger.get('sync_strategy', 'default')} strategy")
    
    # Check for zero-touch sovereignty
    zts = config.get("zero_touch_sovereignty", {})
    if zts.get("enabled"):
        print(f"✅ Zero-touch sovereignty: enabled")
    
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
                        # Create sync PR to update the feature branch with changes from default
                        # This merges default branch INTO the feature branch to bring it up to date
                        try:
                            pr = repo.create_pull(
                                title=f"🔄 Auto-sync: Update {branch.name} from {default_branch}",
                                body=f"FAA Actuary Mastery™ automated synchronization - bringing {branch.name} up to date with latest changes from {default_branch}",
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

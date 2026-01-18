import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 gradient-text">Fruitful™</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Catalyzing a Sector-Driven Ecosystem of Change. Innovate. Connect. Thrive.
            </p>
          </div>

          {/* FAA.ZONE™ Ecosystem */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              FAA.ZONE™ Ecosystem
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://homemart.africa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Homemart.africa
                </a>
              </li>
              <li>
                <a 
                  href="https://faa.zone" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  FAA.ZONE™
                </a>
              </li>
              <li>
                <a 
                  href="https://seedwave.faa.zone" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  SeedWave
                </a>
              </li>
              <li>
                <a 
                  href="https://hotstack.faa.zone" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  HotStack
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/omnigrid"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  OmniGrid
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/vaultmesh"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  VaultMesh™
                </Link>
              </li>
              <li>
                <Link 
                  to="/baobab"
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Baobab Terminal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  Treaty System™
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {currentYear} Fruitful™ - All Rights Reserved</p>
          <p className="mt-2">
            Powered by <span className="font-semibold text-purple-600 dark:text-purple-400">FAA.ZONE™</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

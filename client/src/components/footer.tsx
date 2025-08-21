import { Hand } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Hand className="text-white text-sm" />
              </div>
              <h5 className="text-xl font-bold">PalmRead AI</h5>
            </Link>
            <p className="text-slate-400 mb-6">
              Discover your future through advanced AI-powered palmistry analysis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">Features</h6>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Palm Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Camera Integration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Technology</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Detailed Reports</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">Support</h6>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h6 className="font-semibold mb-4">Legal</h6>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2024 PalmRead AI. All rights reserved. Built with advanced AI technology.</p>
        </div>
      </div>
    </footer>
  );
}


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Sequence Theory, Inc.</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Building tomorrow's decentralized applications today. 
            Stay connected as we shape the future of Web3.
          </p>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-sm">
              © {new Date().getFullYear()} Sequence Theory, Inc. All rights reserved. | 
              <span className="ml-2">Building the future, one block at a time.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

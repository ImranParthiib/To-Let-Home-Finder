"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import NewListingForm from "../components/NewListingForm";
import SearchForm from "../components/SearchForm";
import ListingCard from "../components/ListingCard";
import AuthModal from "../components/AuthModal";

// Function to generate sample listings
const generateSampleListings = (count) => {
  const sampleListings = [];
  for (let i = 1; i <= count; i++) {
    sampleListings.push({
      id: i,
      title: `Sample Home ${i}`,
      location: `City ${i}`,
      price: Math.floor(Math.random() * 1000) + 500,
      description: `This is a sample description for home ${i}.`,
      propertyType: ["apartment", "house", "studio"][
        Math.floor(Math.random() * 3)
      ],
      bedrooms: Math.floor(Math.random() * 3) + 1,
      bathrooms: Math.floor(Math.random() * 2) + 1,
      images: ["/sample-home-image.jpg", "/sample-home-image-2.jpg"],
      amenities: ["Parking", "Wifi", "Gym", "Pool"].slice(
        0,
        Math.floor(Math.random() * 4) + 1
      ),
    });
  }
  return sampleListings;
};

export default function Home() {
  const [showNewListingForm, setShowNewListingForm] = useState(false);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fetch listings from API or use sample data
    const fetchListings = async () => {
      // In a real app, you would fetch from an API
      // For now, we'll use localStorage or generate sample data
      const storedListings = JSON.parse(
        localStorage.getItem("listings") || "[]"
      );
      if (storedListings.length === 0) {
        const sampleData = generateSampleListings(12);
        setListings(sampleData);
        setFilteredListings(sampleData);
        localStorage.setItem("listings", JSON.stringify(sampleData));
      } else {
        setListings(storedListings);
        setFilteredListings(storedListings);
      }
    };
    fetchListings();

    // Check user authentication status
    const token = localStorage.getItem("authToken");
    if (token) {
      // Validate token with backend
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem("user")));
    }

    // Check if user is admin
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const handleNewListing = (formData) => {
    // In a real app, you would upload images to a server and get URLs back
    // For this example, we'll use a placeholder image URL
    const placeholderImageUrl = "/sample-home-image.jpg";

    const newListing = {
      id: Date.now(),
      ...formData,
      landlordId: user.id,
      images:
        formData.images.length > 0
          ? [placeholderImageUrl, placeholderImageUrl]
          : [placeholderImageUrl],
    };
    const updatedListings = [...listings, newListing];
    setListings(updatedListings);
    setFilteredListings(updatedListings);
    localStorage.setItem("listings", JSON.stringify(updatedListings));
    setShowNewListingForm(false);
  };

  const handleSearch = (searchCriteria) => {
    const filtered = listings.filter(
      (listing) =>
        listing.location
          .toLowerCase()
          .includes(searchCriteria.location.toLowerCase()) &&
        listing.price <= searchCriteria.maxPrice &&
        (searchCriteria.propertyType
          ? listing.propertyType === searchCriteria.propertyType
          : true) &&
        (searchCriteria.bedrooms
          ? listing.bedrooms >= searchCriteria.bedrooms
          : true)
    );
    setFilteredListings(filtered);
  };

  const handleLogin = (userData) => {
    // In a real app, validate credentials with backend
    setIsAuthenticated(true);
    setUser(userData);
    setIsAdmin(userData.isAdmin);
    localStorage.setItem("authToken", "dummy-token");
    localStorage.setItem("user", JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  const handleUpdateListing = (updatedListing) => {
    const updatedListings = listings.map((listing) =>
      listing.id === updatedListing.id ? updatedListing : listing
    );
    setListings(updatedListings);
    setFilteredListings(updatedListings);
    localStorage.setItem("listings", JSON.stringify(updatedListings));
  };

  const handleDeleteListing = (listingId) => {
    const updatedListings = listings.filter(
      (listing) => listing.id !== listingId
    );
    setListings(updatedListings);
    setFilteredListings(updatedListings);
    localStorage.setItem("listings", JSON.stringify(updatedListings));
  };

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/to-let-icon.png"
              alt="To Let Icon"
              width={40}  
              height={40}  
              className="rounded-full bg-white p-1 shadow-md"
            />
            <h1 className="text-3xl font-bold">
              {" "}
              <span className="text-yellow-400">To</span>
              <span className="text-white"> Let</span>
            </h1>
          </motion.div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {" "}
              <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="hover:text-yellow-300 transition-colors text-lg"
                >
                  Home
                </Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/search"
                  className="hover:text-yellow-300 transition-colors text-lg"
                >
                  Search
                </Link>
              </motion.li>
              {isAuthenticated && (
                <motion.li
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => setShowNewListingForm(true)}
                    className="hover:text-yellow-300 transition-colors text-lg"
                  >
                    Post a Listing
                  </button>
                </motion.li>
              )}
              <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/about"
                  className="hover:text-yellow-300 transition-colors text-lg"
                >
                  About
                </Link>
              </motion.li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-lg">
                  Welcome, {user.name}
                </span>
                <motion.button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-1 rounded-full hover:bg-yellow-300 hover:text-blue-800 transition-colors shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => setShowAuthModal(true)}
                className="bg-yellow-300 text-blue-800 px-4 py-1 rounded-full hover:bg-white hover:text-blue-600 transition-colors shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login/Register
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-8">
        <motion.section
          className="search-section mb-12 bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Find Your Perfect Home
          </h2>
          <SearchForm onSearch={handleSearch} />
        </motion.section>

        {showNewListingForm && (
          <motion.section
            className="post-section mb-12 bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Post a New Listing
            </h2>
            <NewListingForm onSubmit={handleNewListing} />
          </motion.section>
        )}

        <section className="listings-section">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Available Homes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ListingCard
                  listing={listing}
                  isAdmin={isAdmin}
                  onUpdate={handleUpdateListing}
                  onDelete={handleDeleteListing}
                />
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-300">
                To Let Home Finder helps you find and list rental properties
                easily.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © 2023 To Let Home Finder. All rights reserved.
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

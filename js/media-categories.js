/**
 * Media Categories - Organizes media files into appropriate categories
 * This helps with filtering and displaying media in the gallery
 */

const mediaCategories = {
    // Room categories
    rooms: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.11.jpeg",
            title: "Single Occupancy Room",
            description: "Comfortable private accommodation with all amenities"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.11 (1).jpeg",
            title: "Double Sharing Room",
            description: "Spacious room for two residents with individual storage"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.12.jpeg",
            title: "Triple Sharing Room",
            description: "Affordable accommodation option with all facilities"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.12 (1).jpeg",
            title: "Room Interior",
            description: "Well-furnished rooms with modern amenities"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.12 (2).jpeg",
            title: "Study Area",
            description: "Dedicated space for work and studies"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.14 (2).jpeg",
            title: "Bedroom View",
            description: "Comfortable sleeping arrangements with quality furnishings"
        }
    ],
    
    // Dining area
    dining: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.13.jpeg",
            title: "Dining Hall",
            description: "Spacious dining area for residents"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.13 (1).jpeg",
            title: "Kitchen Facilities",
            description: "Modern kitchen with all necessary equipment"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.13 (2).jpeg",
            title: "Meal Service",
            description: "Nutritious and delicious meals served daily"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.37.33.jpeg",
            title: "Dining Experience",
            description: "Enjoy meals in a comfortable and clean environment"
        }
    ],
    
    // Common areas
    common: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.14.jpeg",
            title: "Common Living Area",
            description: "Comfortable space for relaxation and socializing"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.14 (1).jpeg",
            title: "TV Room",
            description: "Entertainment area with large screen TV"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.15.jpeg",
            title: "Indoor Recreation",
            description: "Games and activities for residents"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 12.24.33.jpeg",
            title: "Lounge Area",
            description: "Comfortable seating for residents to relax and socialize"
        }
    ],
    
    // Exterior and facilities
    exterior: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.15 (1).jpeg",
            title: "Building Exterior",
            description: "Front view of Yasodha Residency"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.15 (2).jpeg",
            title: "Entrance Area",
            description: "Welcoming entrance to the residence"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.16.jpeg",
            title: "Parking Area",
            description: "Secure parking for residents' vehicles"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.16 (1).jpeg",
            title: "Garden Space",
            description: "Green area for relaxation"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.36.55 (1).jpeg",
            title: "Building View",
            description: "Modern and well-maintained residential building"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 12.24.33 (1).jpeg",
            title: "Outdoor Space",
            description: "Beautifully maintained outdoor area for residents"
        }
    ],
    
    // Bathrooms and facilities
    facilities: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.30.jpeg",
            title: "Modern Bathroom",
            description: "Clean and well-maintained bathroom facilities"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.31.jpeg",
            title: "Laundry Area",
            description: "Washing and drying facilities for residents"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.36.55.jpeg",
            title: "Security System",
            description: "24/7 security for resident safety"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.36.55 (1).jpeg",
            title: "WiFi Infrastructure",
            description: "High-speed internet throughout the building"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.37.32.jpeg",
            title: "Utility Area",
            description: "Well-equipped facilities for residents' convenience"
        }
    ],
    
    // Surroundings and neighborhood
    surroundings: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.37.32.jpeg",
            title: "Neighborhood View",
            description: "Peaceful and convenient location"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.37.33.jpeg",
            title: "Nearby Park",
            description: "Green spaces within walking distance"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.37.33 (1).jpeg",
            title: "Local Amenities",
            description: "Shops and services in the vicinity"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.13 (1).jpeg",
            title: "Community Area",
            description: "Safe and friendly neighborhood"
        }
    ],
    
    // Special features
    special: [
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 12.24.33.jpeg",
            title: "Special Events Area",
            description: "Space for celebrations and gatherings"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 12.24.33 (1).jpeg",
            title: "Wellness Corner",
            description: "Area dedicated to health and wellness activities"
        },
        {
            src: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.14 (1).jpeg",
            title: "Study Lounge",
            description: "Quiet space for focused work and study"
        }
    ],
    
    // Videos
    videos: [
        {
            src: "pg-photos/WhatsApp Video 2025-05-04 at 10.35.11.mp4",
            poster: "pg-photos/WhatsApp Image 2025-05-04 at 10.35.11.jpeg",
            title: "Virtual Tour",
            description: "Take a virtual tour of our facilities"
        }
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mediaCategories;
}
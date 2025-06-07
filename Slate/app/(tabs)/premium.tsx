import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Assuming you have @expo/vector-icons installed for checkmarks

const { width, height } = Dimensions.get('window');

export default function PremiumScreen() {
  // State to manage the selected pricing plan
  const [selectedPlan, setSelectedPlan] = useState('12_months');// Default to 12 months as "MOST POPULAR"

  // Fix: Explicitly type the 'plan' parameter as string
  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerBackground}>
          {/* Placeholder for the person image - replace with actual image if available */}
          <Image
            source={{ uri: 'https://placehold.co/150x150/F2EDE9/000000?text=Person' }} // Placeholder image
            style={styles.personImage}
            resizeMode="contain"
          />
          {/* Removed food images as requested */}
        </View>

        {/* Content Section */}
        <View style={styles.contentCard}>
          <View style={styles.offerBanner}>
            <Text style={styles.offerBannerText}>LIMITED TIME OFFER</Text>
          </View>

          <Text style={styles.mainTitle}>
              We’re still building Premium. Chip in to keep Slate growing!
          </Text>

          {/* Feature List */}
          <View style={styles.featureList}>
            {/* Feature Item 1: Progress tracking for your health */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Comprehensive Health Progress Tracking</Text> for detailed insights into your well-being.
              </Text>
            </View>
            {/* Feature Item 2: Super personalized recommendations from your AI health partner */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>AI-Powered Personalized Recommendations</Text> from your dedicated health partner.
              </Text>
            </View>
            {/* Feature Item 3: Daily tracking for gym consistency */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Daily Gym Consistency Tracking</Text> to help you maintain your fitness routine.
              </Text>
            </View>
            {/* Feature Item 4: Advanced nutritional insights and meal planning */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Advanced Nutritional Insights</Text> and personalized meal planning.
              </Text>
            </View>
            {/* Feature Item 5: Real-time performance analytics for workouts */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Real-time Workout Performance Analytics</Text> to optimize your training.
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingContainer}>
          <Text style={styles.mostPopularText}>SUPPORT SLATE</Text>
          <View style={styles.pricingCardsWrapper}>
            {/* 1 Month Card */}
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedPlan === '1_month' && styles.popularCard,
              ]}
              onPress={() => handlePlanSelect('1_month')}
            >
              <Text style={[styles.pricingDuration, selectedPlan === '1_month' && styles.popularDuration]}>1</Text>
              <Text style={[styles.pricingUnit, selectedPlan === '1_month' && styles.popularUnit]}>month</Text>
              <Text style={[styles.originalPrice, selectedPlan === '1_month' && styles.popularOriginalPrice]}>$ 19.99</Text>
              <Text style={[styles.discountedPrice, selectedPlan === '1_month' && styles.popularDiscountedPrice]}>$10</Text>
              <Text style={[styles.billingDetails, selectedPlan === '1_month' && styles.popularBillingDetails]}>$ 10/month</Text>
              <Text style={[styles.billingType, selectedPlan === '1_month' && styles.popularBillingType]}>Billed monthly</Text>
            </TouchableOpacity>

            {/* 12 Months Card (Most Popular) */}
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedPlan === '12_months' && styles.popularCard,
              ]}
              onPress={() => handlePlanSelect('12_months')}
            >
              <Text style={[styles.pricingDuration, selectedPlan === '12_months' && styles.popularDuration]}>12</Text>
              <Text style={[styles.pricingUnit, selectedPlan === '12_months' && styles.popularUnit]}>months</Text>
              <Text style={[styles.originalPrice, selectedPlan === '12_months' && styles.popularOriginalPrice]}>$ 119.99</Text>
              <Text style={[styles.discountedPrice, selectedPlan === '12_months' && styles.popularDiscountedPrice]}>$ 40</Text>
              <Text style={[styles.billingDetails, selectedPlan === '12_months' && styles.popularBillingDetails]}>$ 10/month</Text>
              <Text style={[styles.billingType, selectedPlan === '12_months' && styles.popularBillingType]}>Billed yearly</Text>
            </TouchableOpacity>

            {/* 3 Months Card */}
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedPlan === '3_months' && styles.popularCard,
              ]}
              onPress={() => handlePlanSelect('3_months')}
            >
              <Text style={[styles.pricingDuration, selectedPlan === '3_months' && styles.popularDuration]}>3</Text>
              <Text style={[styles.pricingUnit, selectedPlan === '3_months' && styles.popularUnit]}>months</Text>
              <Text style={[styles.originalPrice, selectedPlan === '3_months' && styles.popularOriginalPrice]}>$ 39.99</Text>
              <Text style={[styles.discountedPrice, selectedPlan === '3_months' && styles.popularDiscountedPrice]}>$ 20</Text>
              <Text style={[styles.billingDetails, selectedPlan === '3_months' && styles.popularBillingDetails]}>$ 10/month</Text>
              <Text style={[styles.billingType, selectedPlan === '3_months' && styles.popularBillingType]}>Billed quarterly</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>CONTINUE</Text>
        </TouchableOpacity>

        
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#F2EDE9', // Background color for the entire screen
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2EDE9',
    paddingBottom: height * 0.02, // Add some padding at the bottom
  },
  headerBackground: {
    width: '100%',
    height: height * 0.15, // Adjust height as needed, relative to screen height
    backgroundColor: '#C0B3A2', // A light green color to simulate the background behind the person
    borderBottomLeftRadius: width * 0.25, // Relative border radius (half of previous)
    borderBottomRightRadius: width * 0.25, // Relative border radius (half of previous)
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginBottom: -height * 0.06, // Overlap with the content card, relative to screen height
  },
  personImage: {
    width: width * 0.35, // Relative width
    height: width * 0.35, // Relative height to maintain aspect ratio
    borderRadius: (width * 0.35) / 2, // Make it circular, relative to size
    position: 'absolute',
    bottom: -height * 0.09, // Adjust to position relative to the header background, relative to screen height
    zIndex: 1, // Ensure it's above other elements if needed
    // You'll need to replace the placeholder with the actual image from the screenshot
    // For now, it's a simple placeholder
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: width * 0.05, // Relative border radius
    padding: width * 0.05, // Relative padding
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 }, // Relative shadow offset
    shadowOpacity: 0.1,
    shadowRadius: width * 0.012, // Relative shadow radius
    elevation: 5,
    marginTop: height * 0.06, // Adjust based on header overlap, relative to screen height
  },
  offerBanner: {
    backgroundColor: '#FFDDC1', // Light orange background
    borderRadius: width * 0.035, // Relative border radius
    paddingVertical: height * 0.01, // Relative padding
    paddingHorizontal: width * 0.04, // Relative padding
    marginBottom: height * 0.02, // Relative margin
    alignSelf: 'flex-start', // Align to the left
  },
  offerBannerText: {
    color: '#E07B00', // Darker orange text
    fontWeight: 'bold',
    fontSize: width * 0.03, // Relative font size
  },
  mainTitle: {
    fontSize: width * 0.055, // Relative font size
    fontWeight: 'bold',
    marginBottom: height * 0.02, // Relative margin
    color: '#333',
  },
  featureList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align text to the top if it wraps
    marginBottom: height * 0.018, // Relative margin
  },
  checkIcon: {
    marginRight: width * 0.025, // Relative margin
    marginTop: height * 0.002, // Adjust to align with text, relative to screen height
  },
  featureText: {
    flex: 1, // Allow text to wrap
    fontSize: width * 0.04, // Relative font size
    color: '#555',
    lineHeight: height * 0.028, // Improve readability, relative to screen height
  },
  boldText: {
    fontWeight: 'bold',
  },
  pricingContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.035, // Relative margin
  },
  mostPopularText: {
    fontSize: width * 0.03, // Relative font size
    fontWeight: 'bold',
    color: '#888',
    marginBottom: height * 0.012, // Relative margin
  },
  pricingCardsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    flexWrap: 'wrap', // Allow cards to wrap on smaller screens
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.035, // Relative border radius
    padding: width * 0.035, // Relative padding
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.28, // Roughly 1/3 of screen width minus spacing
    marginHorizontal: width * 0.012, // Relative margin
    marginVertical: height * 0.012, // Relative margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 }, // Relative shadow offset
    shadowOpacity: 0.1,
    shadowRadius: width * 0.012, // Relative shadow radius
    elevation: 5,
    height: height * 0.20, // Fixed height for consistency, relative to screen height
  },
  popularCard: {
    backgroundColor: '#FF9800', // Orange background for most popular
    shadowColor: '#FF9800',
    shadowOpacity: 0.3,
    shadowRadius: width * 0.025, // Relative shadow radius
  },
  pricingDuration: {
    fontSize: width * 0.07, // Relative font size
    fontWeight: 'bold',
    color: '#333',
  },
  pricingUnit: {
    fontSize: width * 0.035, // Relative font size
    color: '#555',
    marginBottom: height * 0.006, // Relative margin
  },
  originalPrice: {
    fontSize: width * 0.035, // Relative font size
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: height * 0.002, // Relative margin
  },
  discountedPrice: {
    fontSize: width * 0.045, // Relative font size
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.012, // Relative margin
  },
  billingDetails: {
    fontSize: width * 0.03, // Relative font size
    fontWeight: 'bold',
    color: '#333',
  },
  billingType: {
    fontSize: width * 0.025, // Relative font size
    color: '#666',
  },
  popularDuration: {
    color: '#FFF',
  },
  popularUnit: {
    color: '#FFF',
  },
  popularOriginalPrice: {
    color: '#FFF',
  },
  popularDiscountedPrice: {
    color: '#FFF',
  },
  popularBillingDetails: {
    color: '#FFF',
  },
  popularBillingType: {
    color: '#FFF',
  },
  continueButton: {
    backgroundColor: '#FF9800', // Orange button
    width: '90%',
    paddingVertical: height * 0.018, // Relative padding
    borderRadius: width * 0.075, // Relative border radius
    alignItems: 'center',
    marginTop: height * 0.035, // Relative margin
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: height * 0.006 }, // Relative shadow offset
    shadowOpacity: 0.3,
    shadowRadius: width * 0.025, // Relative shadow radius
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // Relative font size
    fontWeight: 'bold',
  },
  footer: {
    marginTop: height * 0.025, // Relative margin
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // Relative padding
  },
  footerCheckIcon: {
    marginBottom: height * 0.006, // Relative margin
  },
  footerText: {
    fontSize: width * 0.03, // Relative font size
    color: '#888',
    textAlign: 'center',
    marginBottom: height * 0.012, // Relative margin
  },
  privacyTermsText: {
    fontSize: width * 0.03, // Relative font size
    color: '#888',
    textDecorationLine: 'underline',
  },
});

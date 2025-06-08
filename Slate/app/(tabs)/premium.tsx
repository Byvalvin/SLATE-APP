import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PremiumScreen() {
  // State to manage the selected donation amount
  const [selectedDonation, setSelectedDonation] = useState('40_dollars'); // Default to $40 as suggested

  const handleDonationSelect = (amount: string) => {
    setSelectedDonation(amount);
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerBackground}>
          <Image
            source={{ uri: 'https://placehold.co/150x150/F2EDE9/000000?text=Person' }}
            style={styles.personImage}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentCard}>
          <Text style={styles.mainTitle}>
            We’re still building Slate. Chip in to keep Slate growing!
          </Text>

          {/* Feature List */}
          <View style={styles.featureList}>
            {/* Feature Item 1: Comprehensive Health Progress Tracking */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Comprehensive Health Progress Tracking</Text> for detailed insights into your well-being.
              </Text>
            </View>
            {/* Feature Item 2: AI-Powered Personalized Recommendations */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>AI-Powered Personalized Recommendations</Text> from your dedicated health partner.
              </Text>
            </View>
            {/* Feature Item 3: Daily Gym Consistency Tracking */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Daily Gym Consistency Tracking</Text> to help you maintain your fitness routine.
              </Text>
            </View>
            {/* Feature Item 4: Advanced Nutritional Insights */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Advanced Nutritional Insights</Text> and personalized meal planning.
              </Text>
            </View>
            {/* Feature Item 5: Real-time Workout Performance Analytics */}
            <View style={styles.featureItem}>
              <AntDesign name="checkcircle" size={width * 0.05} color="#60B95B" style={styles.checkIcon} />
              <Text style={styles.featureText}>
                <Text style={styles.boldText}>Real-time Workout Performance Analytics</Text> to optimize your training.
              </Text>
            </View>
          </View>
        </View>

        {/* Donation Section */}
        <View style={styles.pricingContainer}>
          <Text style={styles.supportText}>SUPPORT SLATE</Text>
          <View style={styles.pricingCardsWrapper}>
            {/* $10 Donation Card */}
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedDonation === '10_dollars' && styles.popularCard,
              ]}
              onPress={() => handleDonationSelect('10_dollars')}
            >
              <Text style={[styles.donationAmount, selectedDonation === '10_dollars' && styles.popularDonationAmount]}>$10</Text>
              <Text style={[styles.donationLabel, selectedDonation === '10_dollars' && styles.popularDonationLabel]}>Donation</Text>
              <Text style={[styles.thankYouText, selectedDonation === '10_dollars' && styles.popularThankYouText]}>Thank you!</Text>
            </TouchableOpacity>

            {/* $40 Donation Card (Highlighted) */}
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedDonation === '40_dollars' && styles.popularCard,
              ]}
              onPress={() => handleDonationSelect('40_dollars')}
            >
              <Text style={[styles.donationAmount, selectedDonation === '40_dollars' && styles.popularDonationAmount]}>$40</Text>
              <Text style={[styles.donationLabel, selectedDonation === '40_dollars' && styles.popularDonationLabel]}>Donation</Text>
              <Text style={[styles.thankYouText, selectedDonation === '40_dollars' && styles.popularThankYouText]}>Thank you!!!</Text>
            </TouchableOpacity>

            {/* $20 Donation Card */}
            <TouchableOpacity
              style={[
                styles.pricingCard,
                selectedDonation === '20_dollars' && styles.popularCard,
              ]}
              onPress={() => handleDonationSelect('20_dollars')}
            >
              <Text style={[styles.donationAmount, selectedDonation === '20_dollars' && styles.popularDonationAmount]}>$20</Text>
              <Text style={[styles.donationLabel, selectedDonation === '20_dollars' && styles.popularDonationLabel]}>Donation</Text>
              <Text style={[styles.thankYouText, selectedDonation === '20_dollars' && styles.popularThankYouText]}>Thank you!!</Text>
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
    backgroundColor: '#F2EDE9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2EDE9',
    paddingBottom: height * 0.02,
  },
  headerBackground: {
    width: '100%',
    height: height * 0.15,
    backgroundColor: '#C0B3A2',
    borderBottomLeftRadius: width * 0.25,
    borderBottomRightRadius: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -height * 0.06,
  },
  personImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    position: 'absolute',
    bottom: -height * 0.09,
    zIndex: 1,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: width * 0.05,
    padding: width * 0.05,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.012,
    elevation: 5,
    marginTop: height * 0.06,
  },
  mainTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  featureList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.018,
  },
  checkIcon: {
    marginRight: width * 0.025,
    marginTop: height * 0.002,
  },
  featureText: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#555',
    lineHeight: height * 0.028,
  },
  boldText: {
    fontWeight: 'bold',
  },
  pricingContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.035,
  },
  supportText: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: height * 0.012,
  },
  pricingCardsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    flexWrap: 'wrap',
    // Key change: Vertically align items within the flex container
    alignItems: 'center',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.035,
    padding: width * 0.035,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.28,
    marginHorizontal: width * 0.012,
    // Adjust marginVertical to give more vertical space
    marginVertical: height * 0.02, // Increased from 0.012 to give more room for scaling
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.002 },
    shadowOpacity: 0.1,
    shadowRadius: width * 0.012,
    elevation: 5,
    height: height * 0.18,
    transitionProperty: 'transform, background-color, shadow-color',
    transitionDuration: '200ms',
  },
  popularCard: {
    backgroundColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOpacity: 0.3,
    shadowRadius: width * 0.025,
    transform: [{ scale: 1.15 }],
    // No need for specific margin adjustments here if alignItems is used on wrapper
    // The marginVertical on pricingCard should now provide enough base spacing
  },
  donationAmount: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  donationLabel: {
    fontSize: width * 0.035,
    color: '#555',
    marginBottom: height * 0.01,
  },
  thankYouText: {
    fontSize: width * 0.028,
    color: '#666',
  },
  popularDonationAmount: {
    color: '#FFF',
  },
  popularDonationLabel: {
    color: '#FFF',
  },
  popularThankYouText: {
    color: '#FFF',
  },
  continueButton: {
    backgroundColor: '#FF9800',
    width: '90%',
    paddingVertical: height * 0.018,
    borderRadius: width * 0.075,
    alignItems: 'center',
    marginTop: height * 0.035,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: height * 0.006 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.025,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});
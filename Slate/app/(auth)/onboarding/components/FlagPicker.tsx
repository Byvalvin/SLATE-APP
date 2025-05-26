import React, { useState, useEffect, useRef } from 'react'; // Added useRef for debounce cleanup
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions, // Import Dimensions for relative layout
} from 'react-native';
import { countries } from '../data/countries'; // Assuming 'countries' data structure is correct
import { debounce } from 'lodash'; // Ensure lodash is installed: npm install lodash

// Get screen dimensions for relative sizing
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const FlagPicker = ({ label, value, onChange }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCountries, setVisibleCountries] = useState<typeof countries>([]); // Initially empty
  const [filteredCountries, setFilteredCountries] = useState<typeof countries>([]); // Initially empty

  // Ref for the debounced function to ensure it's always up-to-date
  const debouncedSearchRef = useRef(debounce((query: string) => {
    if (query.trim() === '') {
      setFilteredCountries([]);
      setVisibleCountries([]);
      return;
    }
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCountries(filtered);
    setVisibleCountries(filtered.slice(0, 20)); // Reset to first 20 filtered countries
  }, 300)); // 300ms debounce time

  useEffect(() => {
    // Call the debounced function whenever searchQuery changes
    debouncedSearchRef.current(searchQuery);

    // Cleanup the debounced function on component unmount
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [searchQuery]); // Depend on searchQuery

  const loadMoreCountries = () => {
    if (visibleCountries.length < filteredCountries.length) {
      // Load 20 more countries, or fewer if less than 20 remain
      const nextBatchSize = Math.min(20, filteredCountries.length - visibleCountries.length);
      setVisibleCountries(filteredCountries.slice(0, visibleCountries.length + nextBatchSize));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a country"
        placeholderTextColor="#888" // Added placeholderTextColor for consistency
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
        }}
      />

      {/* Only show the list if there's a search query */}
      {searchQuery.length > 0 && (
        <ScrollView
          style={styles.listContainer}
          onScroll={({ nativeEvent }) => {
            // Trigger lazy loading when user scrolls near the bottom of the list
            const paddingToBottom = 20; // Adjust as needed
            if (
              nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
              nativeEvent.contentSize.height - paddingToBottom
            ) {
              loadMoreCountries();
            }
          }}
          scrollEventThrottle={400}
        >
          {filteredCountries.length === 0 ? (
            <Text style={styles.noResultsText}>No results found</Text>
          ) : (
            visibleCountries.map((item) => {
              // Ensure flagUrl is robust; flagcdn.com typically uses 2-letter codes
              const flagUrl = `https://flagcdn.com/w320/${item.code.toLowerCase()}.png`;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={styles.option}
                  onPress={() => {
                    onChange(item.name);
                    setSearchQuery(''); // Clear search after selection
                  }}
                >
                  <Image
                    source={{ uri: flagUrl }}
                    style={styles.flag}
                    onError={(e) => console.log('Flag load error:', e.nativeEvent.error, flagUrl)} // Basic error handling for image
                  />
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Display selected country below the search/list */}
      {value ? (
        <Text style={styles.selectedCountry}>Selected: {value}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: screenHeight * 0.03, // Relative margin bottom
  },
  label: {
    fontSize: screenWidth * 0.04, // Relative font size
    fontWeight: '300',
    marginBottom: screenHeight * 0.01, // Relative margin bottom
    color: '#111827',
  },
  input: {
    paddingVertical: screenHeight * 0.015, // Relative vertical padding
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding
    borderRadius: screenWidth * 0.015, // Relative border radius
    backgroundColor: '#E5E7EB',
    marginBottom: screenHeight * 0.015, // Relative margin bottom
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#1F2937',
  },
  listContainer: {
    maxHeight: screenHeight * 0.3, // Relative max height (e.g., 30% of screen height)
    borderRadius: screenWidth * 0.015, // Match input/option border radius
    overflow: 'hidden', // Ensures content respects border radius
    backgroundColor: '#FFFFFF', // White background for the list
    shadowColor: '#000', // Add shadow for better visual separation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: screenHeight * 0.015, // Space between list and selected country text
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.015, // Relative vertical padding
    paddingHorizontal: screenWidth * 0.04, // Relative horizontal padding
    borderBottomWidth: StyleSheet.hairlineWidth, // Thin border for separation
    borderBottomColor: '#E5E7EB',
  },
  flag: {
    width: screenWidth * 0.06, // Relative width
    height: screenHeight * 0.02, // Relative height
    marginRight: screenWidth * 0.04, // Relative margin right
    resizeMode: 'contain', // Ensure flag scales correctly
  },
  optionText: {
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#1F2937',
    flex: 1, // Allows text to take available space
  },
  noResultsText: {
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: screenHeight * 0.025, // Relative vertical padding
  },
  selectedCountry: {
    marginTop: screenHeight * 0.015, // Relative margin top
    fontSize: screenWidth * 0.04, // Relative font size
    color: '#111827',
    fontWeight: '500', // Added some weight for clarity
  },
});

export default FlagPicker;

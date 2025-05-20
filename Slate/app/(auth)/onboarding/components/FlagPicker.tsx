import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { countries } from '../data/countries';
import { debounce } from 'lodash';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const FlagPicker = ({ label, value, onChange }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCountries, setVisibleCountries] = useState(countries.slice(0, 20)); // Initial visible countries
  const [filteredCountries, setFilteredCountries] = useState(countries);

  // Debounce the search query to prevent constant filtering
  const handleSearchChange = debounce((query: string) => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCountries(filtered);
    setVisibleCountries(filtered.slice(0, 20)); // Reset to first 20 filtered countries
  }, 300); // 300ms debounce time

  useEffect(() => {
    handleSearchChange(searchQuery);
  }, [searchQuery]);

  const loadMoreCountries = () => {
    if (visibleCountries.length < filteredCountries.length) {
      setVisibleCountries(filteredCountries.slice(0, visibleCountries.length + 20)); // Load 20 more countries
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a country"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
        }} // Trigger the debounced search update
      />

      <ScrollView
        style={styles.listContainer}
        onScroll={({ nativeEvent }) => {
          // Trigger lazy loading when user scrolls to the bottom of the list
          if (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >= nativeEvent.contentSize.height - 20) {
            loadMoreCountries();
          }
        }}
        scrollEventThrottle={400}
      >
        {filteredCountries.length === 0 ? (
          <Text style={styles.noResultsText}>No results found</Text>
        ) : (
          visibleCountries.map((item) => {
            const flagUrl = `https://flagcdn.com/w320/${item.code.toLowerCase()}.png`;
            return (
              <TouchableOpacity
                key={item.code}
                style={styles.option}
                onPress={() => {
                  onChange(item.name);
                  setSearchQuery(''); // Optional: clear search after selection
                }}
              >
                <Image source={{ uri: flagUrl }} style={styles.flag} />
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {value ? (
        <Text style={styles.selectedCountry}>Selected: {value}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  listContainer: {
    maxHeight: 250, // Adjust as needed
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  selectedCountry: {
    marginTop: 12,
    fontSize: 16,
    color: '#111827',
  },
});

export default FlagPicker;

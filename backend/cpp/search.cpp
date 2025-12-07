#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <memory>

/**
 * Trie Node for efficient prefix matching
 * Optimized for e-commerce product search autocomplete
 */
class TrieNode {
public:
    std::map<char, std::unique_ptr<TrieNode>> children;
    bool isEndOfWord;
    std::vector<std::string> suggestions;  // Cached suggestions for O(1) retrieval

    TrieNode() : isEndOfWord(false) {}
};

/**
 * Trie-based search for fast autocomplete
 * Time Complexity: O(k) for insertion/search where k = length of string
 * Space Complexity: O(ALPHABET_SIZE * N * K) where N = number of words, K = avg length
 */
class TrieSearch {
private:
    std::unique_ptr<TrieNode> root;
    int maxSuggestions;

public:
    TrieSearch(int maxSuggestions = 5) : root(std::make_unique<TrieNode>()), maxSuggestions(maxSuggestions) {}

    /**
     * Insert a product into the Trie
     * Also caches top-N suggestions at each node for O(1) retrieval
     */
    void insert(const std::string& productId, const std::string& productName) {
        TrieNode* node = root.get();
        
        for (char c : productName) {
            // Convert to lowercase for case-insensitive search
            c = std::tolower(c);
            
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = std::make_unique<TrieNode>();
            }
            node = node->children[c].get();
            
            // Cache suggestions at each node (only if not already present)
            if (std::find(node->suggestions.begin(), node->suggestions.end(), productId) == node->suggestions.end()) {
                if (node->suggestions.size() < maxSuggestions) {
                    node->suggestions.push_back(productId);
                }
            }
        }
        
        node->isEndOfWord = true;
    }

    /**
     * Search for products matching the prefix
     * Returns vector of product IDs (up to maxSuggestions)
     */
    std::vector<std::string> search(const std::string& prefix) {
        TrieNode* node = root.get();
        
        // Navigate to prefix node: O(k) where k = prefix length
        for (char c : prefix) {
            c = std::tolower(c);
            
            if (node->children.find(c) == node->children.end()) {
                return {};  // No matches
            }
            node = node->children[c].get();
        }
        
        // Return cached suggestions: O(1)
        return node->suggestions;
    }

    /**
     * Get all words with given prefix
     * Used for comprehensive search results beyond top-N
     */
    void getAllWords(TrieNode* node, std::string prefix, std::vector<std::string>& results) {
        if (node->isEndOfWord) {
            results.push_back(prefix);
        }
        
        for (auto& pair : node->children) {
            getAllWords(pair.second.get(), prefix + pair.first, results);
        }
    }

    /**
     * Get full search results beyond cached suggestions
     */
    std::vector<std::string> searchAll(const std::string& prefix) {
        TrieNode* node = root.get();
        
        for (char c : prefix) {
            c = std::tolower(c);
            
            if (node->children.find(c) == node->children.end()) {
                return {};
            }
            node = node->children[c].get();
        }
        
        std::vector<std::string> results;
        getAllWords(node, prefix, results);
        return results;
    }
};

/**
 * Export functions for Node.js binding
 * These will be wrapped by N-API
 */

extern "C" {
    TrieSearch* trie_create(int maxSuggestions) {
        return new TrieSearch(maxSuggestions);
    }

    void trie_insert(TrieSearch* trie, const char* productId, const char* productName) {
        trie->insert(std::string(productId), std::string(productName));
    }

    void trie_search(TrieSearch* trie, const char* prefix, std::vector<std::string>& results) {
        results = trie->search(std::string(prefix));
    }

    void trie_destroy(TrieSearch* trie) {
        delete trie;
    }
}

// Example usage
#ifdef EASY11_CPP_TEST
int main() {
    TrieSearch search(5);
    
    // Insert products
    search.insert("prod-1", "Smartphone Pro Max");
    search.insert("prod-2", "Smartphone Ultra");
    search.insert("prod-3", "Wireless Headphones");
    search.insert("prod-4", "Wireless Mouse");
    search.insert("prod-5", "Laptop Ultra Slim");
    search.insert("prod-6", "Laptop Gaming");
    
    // Test searches
    std::cout << "Search 'smart': ";
    auto results1 = search.search("smart");
    for (const auto& id : results1) {
        std::cout << id << " ";
    }
    std::cout << std::endl;
    
    std::cout << "Search 'lap': ";
    auto results2 = search.search("lap");
    for (const auto& id : results2) {
        std::cout << id << " ";
    }
    std::cout << std::endl;
    
    std::cout << "Search 'wireless': ";
    auto results3 = search.search("wireless");
    for (const auto& id : results3) {
        std::cout << id << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
#endif


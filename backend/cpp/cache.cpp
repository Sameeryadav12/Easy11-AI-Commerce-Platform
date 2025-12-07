#include <iostream>
#include <string>
#include <unordered_map>
#include <memory>

/**
 * LRU Cache Node
 * Doubly-linked list node for O(1) insertion and deletion
 */
template<typename K, typename V>
class LRUNode {
public:
    K key;
    V value;
    LRUNode* prev;
    LRUNode* next;

    LRUNode(K k, V v) : key(k), value(v), prev(nullptr), next(nullptr) {}
};

/**
 * LRU (Least Recently Used) Cache
 * Implements O(1) get and put operations using:
 * - HashMap for O(1) key lookup
 * - Doubly-linked list for O(1) insertion/deletion
 * 
 * Time Complexity: O(1) for both get and put
 * Space Complexity: O(capacity)
 */
template<typename K, typename V>
class LRUCache {
private:
    std::unordered_map<K, LRUNode<K, V>*> cache;
    LRUNode<K, V>* head;
    LRUNode<K, V>* tail;
    int capacity;
    int size;

    /**
     * Add node to the head of the list
     */
    void addToHead(LRUNode<K, V>* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }

    /**
     * Remove node from the list
     */
    void removeNode(LRUNode<K, V>* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    /**
     * Move node to head (most recently used)
     */
    void moveToHead(LRUNode<K, V>* node) {
        removeNode(node);
        addToHead(node);
    }

    /**
     * Remove tail node (least recently used)
     */
    LRUNode<K, V>* removeTail() {
        LRUNode<K, V>* node = tail->prev;
        removeNode(node);
        return node;
    }

public:
    LRUCache(int cap) : capacity(cap), size(0) {
        // Create dummy head and tail nodes
        head = new LRUNode<K, V>(K(), V());
        tail = new LRUNode<K, V>(K(), V());
        head->next = tail;
        tail->prev = head;
    }

    ~LRUCache() {
        // Clean up all nodes
        while (head != nullptr) {
            LRUNode<K, V>* temp = head;
            head = head->next;
            delete temp;
        }
    }

    /**
     * Get value by key
     * Updates node position to head (most recently used)
     */
    V get(const K& key) {
        auto it = cache.find(key);
        if (it == cache.end()) {
            return V();  // Not found
        }

        LRUNode<K, V>* node = it->second;
        moveToHead(node);
        return node->value;
    }

    /**
     * Put key-value pair
     * If key exists, update value and move to head
     * If new key and cache full, evict least recently used
     */
    void put(const K& key, const V& value) {
        auto it = cache.find(key);
        
        if (it != cache.end()) {
            // Key exists, update value and move to head
            LRUNode<K, V>* node = it->second;
            node->value = value;
            moveToHead(node);
        } else {
            // New key
            if (size >= capacity) {
                // Cache full, evict LRU
                LRUNode<K, V>* tail = removeTail();
                cache.erase(tail->key);
                delete tail;
                size--;
            }

            // Add new node
            LRUNode<K, V>* newNode = new LRUNode<K, V>(key, value);
            cache[key] = newNode;
            addToHead(newNode);
            size++;
        }
    }

    /**
     * Check if key exists
     */
    bool exists(const K& key) const {
        return cache.find(key) != cache.end();
    }

    /**
     * Get current cache size
     */
    int getSize() const {
        return size;
    }

    /**
     * Clear all entries
     */
    void clear() {
        while (head->next != tail) {
            LRUNode<K, V>* node = removeTail();
            delete node;
        }
        cache.clear();
        size = 0;
    }
};

/**
 * Typedef for common use case: string -> string cache
 */
using StringCache = LRUCache<std::string, std::string>;

/**
 * Export functions for Node.js binding
 */
extern "C" {
    StringCache* cache_create(int capacity) {
        return new StringCache(capacity);
    }

    const char* cache_get(StringCache* cache, const char* key, char* buffer, int bufferSize) {
        std::string value = cache->get(std::string(key));
        if (value.empty()) {
            return nullptr;
        }
        strncpy(buffer, value.c_str(), bufferSize - 1);
        buffer[bufferSize - 1] = '\0';
        return buffer;
    }

    void cache_put(StringCache* cache, const char* key, const char* value) {
        cache->put(std::string(key), std::string(value));
    }

    int cache_exists(StringCache* cache, const char* key) {
        return cache->exists(std::string(key)) ? 1 : 0;
    }

    int cache_size(StringCache* cache) {
        return cache->getSize();
    }

    void cache_clear(StringCache* cache) {
        cache->clear();
    }

    void cache_destroy(StringCache* cache) {
        delete cache;
    }
}

// Example usage
#ifdef EASY11_CPP_TEST
int main() {
    StringCache cache(3);

    std::cout << "=== LRU Cache Test ===" << std::endl;

    // Test put and get
    cache.put("user-1", "{\"name\":\"John\",\"role\":\"admin\"}");
    cache.put("user-2", "{\"name\":\"Jane\",\"role\":\"user\"}");
    cache.put("user-3", "{\"name\":\"Bob\",\"role\":\"analyst\"}");

    std::cout << "Cache size: " << cache.getSize() << std::endl;
    std::cout << "Get user-1: " << cache.get("user-1") << std::endl;

    // Add new entry (should evict user-2)
    cache.put("user-4", "{\"name\":\"Alice\",\"role\":\"manager\"}");
    
    std::cout << "Cache size after adding user-4: " << cache.getSize() << std::endl;
    std::cout << "Get user-2 (should be empty): " << cache.get("user-2") << std::endl;
    std::cout << "Get user-3: " << cache.get("user-3") << std::endl;

    // Access user-1 again (should still exist)
    std::cout << "Get user-1 again: " << cache.get("user-1") << std::endl;

    std::cout << "\n=== Cache Operations ===" << std::endl;
    std::cout << "Exists user-4: " << (cache.exists("user-4") ? "Yes" : "No") << std::endl;
    std::cout << "Exists user-2: " << (cache.exists("user-2") ? "Yes" : "No") << std::endl;

    cache.clear();
    std::cout << "Cache size after clear: " << cache.getSize() << std::endl;

    return 0;
}
#endif


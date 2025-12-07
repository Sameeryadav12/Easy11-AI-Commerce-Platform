# 🧮 Data Structures & Algorithms in Easy11

## Table of Contents

1. [Search Autocomplete (Trie)](#1-search-autocomplete-trie)
2. [Recommendations (ALS Matrix Factorization)](#2-recommendations-als-matrix-factorization)
3. [Trending Products (Min-Heap + EMA)](#3-trending-products-min-heap--ema)
4. [Price Filtering (Segment Tree)](#4-price-filtering-segment-tree)
5. [Pagination (Cursor + Binary Search)](#5-pagination-cursor--binary-search)
6. [Cache (LRU)](#6-cache-lru)
7. [Churn & CLV (Priority Queue)](#7-churn--clv-priority-queue)
8. [Search Index (Inverted Index)](#8-search-index-inverted-index)

---

## 1. Search Autocomplete (Trie)

### Problem
Fast prefix-based product search with O(k) lookup time for k-character queries.

### Solution: Trie (Prefix Tree)

```cpp
class TrieNode {
public:
    std::map<char, TrieNode*> children;
    bool isEndOfWord;
    std::vector<std::string> suggestions;  // Cached suggestions
    
    TrieNode() : isEndOfWord(false) {}
};

class Trie {
private:
    TrieNode* root;
    
public:
    Trie() : root(new TrieNode()) {}
    
    void insert(const std::string& word, const std::string& productId) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
            
            // Cache top-5 suggestions at each node
            if (node->suggestions.size() < 5) {
                node->suggestions.push_back(productId);
            }
        }
        node->isEndOfWord = true;
    }
    
    std::vector<std::string> search(const std::string& prefix) {
        TrieNode* node = root;
        
        // Navigate to prefix node: O(k) where k = prefix length
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return {};
            }
            node = node->children[c];
        }
        
        // Return cached suggestions: O(1)
        return node->suggestions;
    }
};
```

### Complexity
- **Insert**: O(k) where k = word length
- **Search**: O(k) where k = prefix length
- **Space**: O(Σ nᵢ × kᵢ) where nᵢ = product count, kᵢ = average length

### Use Case
Real-time autocomplete in frontend search bar with <50ms latency.

---

## 2. Recommendations (ALS Matrix Factorization)

### Problem
Scalable collaborative filtering for personalized product recommendations with sparse user-item matrices.

### Solution: ALS (Alternating Least Squares)

```cpp
class ALSRecommender {
private:
    int nUsers, nItems;
    int factors;           // Latent factors
    double lambda;         // Regularization
    SparseMatrix R;        // User-item interactions
    
    Matrix X;              // User embeddings [nUsers x factors]
    Matrix Y;              // Item embeddings [nItems x factors]
    
    void optimizeX() {
        for (int u = 0; u < nUsers; u++) {
            // Items rated by user u
            std::vector<int> items = R.getUserRatings(u);
            
            if (items.empty()) continue;
            
            Matrix YtY = Matrix::zeros(factors, factors);
            Matrix RY = Matrix::zeros(factors, 1);
            
            for (int i : items) {
                YtY = YtY + Y.col(i) * Y.col(i).transpose();
                double r_ui = R.get(u, i);
                RY = RY + Y.col(i) * r_ui;
            }
            
            // Closed-form solution: X[u] = (YtY + λI)⁻¹ × RY
            Matrix reg = YtY + Matrix::identity(factors) * lambda;
            X.row(u) = reg.inverse() * RY;
        }
    }
    
    void optimizeY() {
        // Similar to optimizeX but for items
        for (int i = 0; i < nItems; i++) {
            std::vector<int> users = R.getItemRatings(i);
            
            if (users.empty()) continue;
            
            Matrix XtX = Matrix::zeros(factors, factors);
            Matrix RX = Matrix::zeros(factors, 1);
            
            for (int u : users) {
                XtX = XtX + X.col(u) * X.col(u).transpose();
                double r_ui = R.get(u, i);
                RX = RX + X.col(u) * r_ui;
            }
            
            Matrix reg = XtX + Matrix::identity(factors) * lambda;
            Y.row(i) = reg.inverse() * RX;
        }
    }
    
public:
    ALSRecommender(int users, int items, int f, double reg) 
        : nUsers(users), nItems(items), factors(f), lambda(reg) {
        X = Matrix::random(nUsers, factors);
        Y = Matrix::random(nItems, factors);
    }
    
    void train(int iterations) {
        for (int iter = 0; iter < iterations; iter++) {
            optimizeX();
            optimizeY();
        }
    }
    
    std::vector<std::pair<int, double>> recommend(int userId, int topK) {
        Vector scores = X.row(userId) * Y.transpose();
        
        // Use min-heap to find top-K: O(n log k)
        std::priority_queue<
            std::pair<double, int>,
            std::vector<std::pair<double, int>>,
            std::greater<std::pair<double, int>>
        > heap;
        
        for (int i = 0; i < scores.size(); i++) {
            if (heap.size() < topK) {
                heap.push({scores[i], i});
            } else if (scores[i] > heap.top().first) {
                heap.pop();
                heap.push({scores[i], i});
            }
        }
        
        std::vector<std::pair<int, double>> recommendations;
        while (!heap.empty()) {
            auto [score, itemId] = heap.top();
            heap.pop();
            recommendations.push_back({itemId, score});
        }
        
        std::reverse(recommendations.begin(), recommendations.end());
        return recommendations;
    }
};
```

### Complexity
- **Training**: O(iterations × (|R| × factors² + (nUsers + nItems) × factors³))
- **Recommendation**: O(n log k) where k = top-K
- **Space**: O(nUsers × factors + nItems × factors)

### Use Case
Personalized product recommendations with HitRate@10 > 0.20.

---

## 3. Trending Products (Min-Heap + EMA)

### Problem
Real-time ranking of trending products based on exponential moving average.

### Solution: Min-Heap + EMA

```cpp
class TrendingProducts {
private:
    struct ProductScore {
        int productId;
        double score;
        time_t timestamp;
        
        bool operator<(const ProductScore& other) const {
            return score < other.score;
        }
    };
    
    std::priority_queue<ProductScore> heap;  // Min-heap
    std::map<int, ProductScore> scores;
    
    double calculateEMA(const ProductScore& current, const ProductScore& previous, double alpha) {
        return alpha * current.score + (1 - alpha) * previous.score;
    }
    
public:
    void updateScore(int productId, double viewCount, double purchaseCount) {
        double score = viewCount + 2 * purchaseCount;  // Weighted score
        time_t now = time(nullptr);
        
        if (scores.find(productId) == scores.end()) {
            scores[productId] = {productId, score, now};
        } else {
            ProductScore& prev = scores[productId];
            scores[productId].score = calculateEMA({productId, score, now}, prev, 0.3);
            scores[productId].timestamp = now;
        }
        
        // Maintain top-K in heap
        if (heap.size() < 10 || scores[productId].score > heap.top().score) {
            heap.push(scores[productId]);
            
            if (heap.size() > 10) {
                heap.pop();
            }
        }
    }
    
    std::vector<int> getTrending(int k) {
        std::vector<int> result;
        std::vector<ProductScore> temp;
        
        while (!heap.empty()) {
            temp.push_back(heap.top());
            heap.pop();
        }
        
        for (auto& item : temp) {
            heap.push(item);  // Restore heap
        }
        
        for (int i = 0; i < k && i < temp.size(); i++) {
            result.push_back(temp[i].productId);
        }
        
        return result;
    }
};
```

### Complexity
- **Update**: O(log k) where k = heap size
- **Get Trending**: O(k log k)
- **Space**: O(n) where n = total products

### Use Case
Homepage trending products section with <10ms update latency.

---

## 4. Price Filtering (Segment Tree)

### Problem
Efficient range queries for price filtering with O(log n) per query.

### Solution: Segment Tree

```cpp
class SegmentTree {
private:
    struct Node {
        int minPrice;
        int maxPrice;
        int count;      // Products in range
        
        Node() : minPrice(INT_MAX), maxPrice(INT_MIN), count(0) {}
    };
    
    std::vector<Node> tree;
    int n;
    
    void build(int node, int start, int end, const std::vector<int>& prices) {
        if (start == end) {
            tree[node].minPrice = tree[node].maxPrice = prices[start];
            tree[node].count = 1;
        } else {
            int mid = (start + end) / 2;
            build(2 * node, start, mid, prices);
            build(2 * node + 1, mid + 1, end, prices);
            
            tree[node].minPrice = std::min(tree[2 * node].minPrice, tree[2 * node + 1].minPrice);
            tree[node].maxPrice = std::max(tree[2 * node].maxPrice, tree[2 * node + 1].maxPrice);
            tree[node].count = tree[2 * node].count + tree[2 * node + 1].count;
        }
    }
    
    int queryRange(int node, int start, int end, int l, int r, int minPrice, int maxPrice) {
        if (r < start || end < l || tree[node].minPrice > maxPrice || tree[node].maxPrice < minPrice) {
            return 0;  // No overlap
        }
        
        if (l <= start && end <= r && tree[node].minPrice >= minPrice && tree[node].maxPrice <= maxPrice) {
            return tree[node].count;  // Complete overlap
        }
        
        int mid = (start + end) / 2;
        return queryRange(2 * node, start, mid, l, r, minPrice, maxPrice) +
               queryRange(2 * node + 1, mid + 1, end, l, r, minPrice, maxPrice);
    }
    
public:
    SegmentTree(const std::vector<int>& prices) : n(prices.size()) {
        tree.resize(4 * n);
        build(1, 0, n - 1, prices);
    }
    
    int countInRange(int minPrice, int maxPrice) {
        return queryRange(1, 0, n - 1, 0, n - 1, minPrice, maxPrice);
    }
};
```

### Complexity
- **Build**: O(n)
- **Query**: O(log n)
- **Space**: O(n)

### Use Case
Product listing page with real-time price filter updates.

---

## 5. Pagination (Cursor + Binary Search)

### Problem
Efficient pagination for large datasets without OFFSET performance degradation.

### Solution: Cursor-Based Pagination

```cpp
class PaginatedQuery {
public:
    struct Cursor {
        time_t timestamp;
        std::string id;
        
        bool operator<(const Cursor& other) const {
            if (timestamp != other.timestamp) {
                return timestamp < other.timestamp;
            }
            return id < other.id;
        }
    };
    
    std::vector<Cursor> getPage(const std::vector<Cursor>& items, 
                                const Cursor& lastCursor, 
                                int limit) {
        // Binary search for cursor position: O(log n)
        auto it = std::lower_bound(items.begin(), items.end(), lastCursor);
        
        if (it != items.end() && *it == lastCursor) {
            ++it;  // Skip the cursor itself
        }
        
        std::vector<Cursor> result;
        for (int i = 0; i < limit && it != items.end(); i++, it++) {
            result.push_back(*it);
        }
        
        return result;
    }
};
```

### Complexity
- **Query**: O(log n + k) where k = page size
- **Space**: O(1) additional space

### Use Case
Infinite scroll pagination for orders, products, analytics.

---

## 6. Cache (LRU)

### Problem
High-performance key-value caching with LRU eviction policy.

### Solution: LRU Cache with LinkedHashMap

```cpp
class LRUCache {
private:
    struct Node {
        int key;
        std::string value;
        Node* prev;
        Node* next;
        
        Node(int k, const std::string& v) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };
    
    int capacity;
    std::unordered_map<int, Node*> cache;
    Node* head;
    Node* tail;
    
    void addToHead(Node* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }
    
    void removeNode(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    
    Node* removeTail() {
        Node* last = tail->prev;
        removeNode(last);
        return last;
    }
    
public:
    LRUCache(int cap) : capacity(cap) {
        head = new Node(-1, "");
        tail = new Node(-1, "");
        head->next = tail;
        tail->prev = head;
    }
    
    std::string get(int key) {
        if (cache.find(key) == cache.end()) {
            return "";  // Not found
        }
        
        Node* node = cache[key];
        removeNode(node);
        addToHead(node);
        
        return node->value;
    }
    
    void put(int key, const std::string& value) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->value = value;
            removeNode(node);
            addToHead(node);
        } else {
            if (cache.size() >= capacity) {
                Node* tail = removeTail();
                cache.erase(tail->key);
                delete tail;
            }
            
            Node* newNode = new Node(key, value);
            cache[key] = newNode;
            addToHead(newNode);
        }
    }
};
```

### Complexity
- **Get**: O(1)
- **Put**: O(1)
- **Space**: O(capacity)

### Use Case
Product catalog caching, session management, API response caching.

---

## 7. Churn & CLV (Priority Queue)

### Problem
Real-time ranking of customers by churn risk and customer lifetime value.

### Solution: Priority Queue

```cpp
class CustomerRanker {
private:
    struct Customer {
        int id;
        double churnScore;
        double clv;
        
        bool operator<(const Customer& other) const {
            // Rank by churn risk (higher = more at risk)
            if (churnScore != other.churnScore) {
                return churnScore < other.churnScore;
            }
            return clv < other.clv;
        }
    };
    
    std::priority_queue<Customer> churnHeap;
    std::priority_queue<Customer> clvHeap;
    
public:
    void updateChurnScore(int customerId, double score, double clv) {
        churnHeap.push({customerId, score, clv});
    }
    
    void updateCLV(int customerId, double clv, double churnScore) {
        clvHeap.push({customerId, churnScore, clv});
    }
    
    std::vector<int> getAtRiskCustomers(int topK) {
        std::vector<int> result;
        std::vector<Customer> temp;
        
        for (int i = 0; i < topK && !churnHeap.empty(); i++) {
            Customer c = churnHeap.top();
            churnHeap.pop();
            result.push_back(c.id);
            temp.push_back(c);
        }
        
        for (auto& c : temp) {
            churnHeap.push(c);
        }
        
        return result;
    }
    
    std::vector<int> getTopCLVCustomers(int topK) {
        std::vector<int> result;
        std::vector<Customer> temp;
        
        for (int i = 0; i < topK && !clvHeap.empty(); i++) {
            Customer c = clvHeap.top();
            clvHeap.pop();
            result.push_back(c.id);
            temp.push_back(c);
        }
        
        for (auto& c : temp) {
            clvHeap.push(c);
        }
        
        return result;
    }
};
```

### Complexity
- **Update**: O(log n)
- **Get Top-K**: O(k log n)
- **Space**: O(n)

### Use Case
Admin dashboard customer insights, targeted marketing campaigns.

---

## 8. Search Index (Inverted Index)

### Problem
Fast full-text search with TF-IDF ranking.

### Solution: Inverted Index + TF-IDF

```cpp
class InvertedIndex {
private:
    struct Posting {
        int docId;
        double tf;      // Term frequency
        
        bool operator<(const Posting& other) const {
            return docId < other.docId;
        }
    };
    
    std::map<std::string, std::vector<Posting>> index;
    std::map<int, std::string> documents;
    int totalDocs;
    
    double calculateTF(const std::string& term, int docId) {
        // Simple TF: count / total terms in document
        int count = 0;
        int totalTerms = 0;
        
        std::istringstream iss(documents[docId]);
        std::string word;
        while (iss >> word) {
            totalTerms++;
            if (word == term) count++;
        }
        
        return totalTerms > 0 ? (double)count / totalTerms : 0.0;
    }
    
    double calculateIDF(const std::string& term) {
        int docFreq = index[term].size();
        return docFreq > 0 ? std::log((double)totalDocs / docFreq) : 0.0;
    }
    
public:
    void indexDocument(int docId, const std::string& text) {
        documents[docId] = text;
        
        std::istringstream iss(text);
        std::string word;
        std::set<std::string> uniqueTerms;
        
        while (iss >> word) {
            // Simple tokenization (add stemming in production)
            std::transform(word.begin(), word.end(), word.begin(), ::tolower);
            uniqueTerms.insert(word);
        }
        
        for (const std::string& term : uniqueTerms) {
            double tf = calculateTF(term, docId);
            index[term].push_back({docId, tf});
        }
    }
    
    std::vector<std::pair<int, double>> search(const std::string& query) {
        std::istringstream iss(query);
        std::string term;
        std::map<int, double> scores;
        
        while (iss >> term) {
            std::transform(term.begin(), term.end(), term.begin(), ::tolower);
            
            if (index.find(term) == index.end()) continue;
            
            double idf = calculateIDF(term);
            
            for (const Posting& posting : index[term]) {
                double tfidf = posting.tf * idf;
                scores[posting.docId] += tfidf;
            }
        }
        
        std::vector<std::pair<int, double>> results;
        for (auto& [docId, score] : scores) {
            results.push_back({docId, score});
        }
        
        std::sort(results.begin(), results.end(), 
                  [](const auto& a, const auto& b) { return a.second > b.second; });
        
        return results;
    }
};
```

### Complexity
- **Index**: O(n × m) where n = documents, m = avg terms/doc
- **Search**: O(k × log n) where k = query terms
- **Space**: O(Σ nᵢ) where nᵢ = unique terms in corpus

### Use Case
Product search with relevance ranking.

---

## Performance Summary

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| Trie Search | O(k) | O(n × k) | Autocomplete |
| ALS Recommendations | O(iter × (|R| × f²)) | O(n × f) | Collaborative filtering |
| Min-Heap Trending | O(log k) | O(n) | Real-time rankings |
| Segment Tree Filter | O(log n) | O(n) | Range queries |
| Cursor Pagination | O(log n) | O(1) | Large dataset pagination |
| LRU Cache | O(1) | O(capacity) | High-speed caching |
| Priority Queue CLV | O(log n) | O(n) | Customer ranking |
| Inverted Index | O(k × log n) | O(n × m) | Full-text search |

---

## Implementation Notes

1. **C++ Modules**: All algorithms implemented in `backend/cpp/`
2. **Node-API Bindings**: Exposed to Node.js via N-API
3. **Testing**: Unit tests with Google Test
4. **Benchmarking**: Performance tests for each algorithm

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained by**: Ocean & Sameer


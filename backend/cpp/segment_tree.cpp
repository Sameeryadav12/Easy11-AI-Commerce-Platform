#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

/**
 * Segment Tree Node
 * Supports range queries and updates
 */
struct SegmentNode {
    int minPrice;
    int maxPrice;
    int count;  // Number of products in range

    SegmentNode() : minPrice(INT_MAX), maxPrice(INT_MIN), count(0) {}
    
    SegmentNode(int price) : minPrice(price), maxPrice(price), count(1) {}
    
    SegmentNode(int min, int max, int cnt) : minPrice(min), maxPrice(max), count(cnt) {}
};

/**
 * Segment Tree for Range Queries
 * Optimized for price filtering in e-commerce
 * 
 * Time Complexity: O(log n) for query and update
 * Space Complexity: O(n)
 */
class SegmentTree {
private:
    std::vector<SegmentNode> tree;
    std::vector<int> prices;
    int n;

    /**
     * Build segment tree recursively
     */
    void build(int node, int start, int end) {
        if (start == end) {
            // Leaf node
            tree[node] = SegmentNode(prices[start]);
        } else {
            int mid = (start + end) / 2;
            
            // Build left and right subtrees
            build(2 * node, start, mid);
            build(2 * node + 1, mid + 1, end);
            
            // Merge children
            tree[node] = merge(tree[2 * node], tree[2 * node + 1]);
        }
    }

    /**
     * Merge two segment nodes
     */
    SegmentNode merge(const SegmentNode& left, const SegmentNode& right) {
        return SegmentNode(
            std::min(left.minPrice, right.minPrice),
            std::max(left.maxPrice, right.maxPrice),
            left.count + right.count
        );
    }

    /**
     * Query range [l, r] from node [start, end]
     */
    SegmentNode queryRange(int node, int start, int end, int l, int r, int minPrice, int maxPrice) {
        // No overlap
        if (r < start || end < l || tree[node].minPrice > maxPrice || tree[node].maxPrice < minPrice) {
            return SegmentNode();
        }
        
        // Complete overlap and within price range
        if (l <= start && end <= r && tree[node].minPrice >= minPrice && tree[node].maxPrice <= maxPrice) {
            return tree[node];
        }
        
        // Partial overlap
        int mid = (start + end) / 2;
        SegmentNode leftResult = queryRange(2 * node, start, mid, l, r, minPrice, maxPrice);
        SegmentNode rightResult = queryRange(2 * node + 1, mid + 1, end, l, r, minPrice, maxPrice);
        
        return merge(leftResult, rightResult);
    }

    /**
     * Update price at index
     */
    void update(int node, int start, int end, int index, int newPrice) {
        if (start == end) {
            // Leaf node
            prices[index] = newPrice;
            tree[node] = SegmentNode(newPrice);
        } else {
            int mid = (start + end) / 2;
            
            if (index <= mid) {
                update(2 * node, start, mid, index, newPrice);
            } else {
                update(2 * node + 1, mid + 1, end, index, newPrice);
            }
            
            // Update parent
            tree[node] = merge(tree[2 * node], tree[2 * node + 1]);
        }
    }

public:
    /**
     * Initialize segment tree from prices vector
     */
    SegmentTree(const std::vector<int>& priceVector) {
        prices = priceVector;
        n = prices.size();
        tree.resize(4 * n);
        build(1, 0, n - 1);
    }

    /**
     * Count products in price range [minPrice, maxPrice]
     */
    int countInRange(int minPrice, int maxPrice) {
        if (n == 0) return 0;
        
        SegmentNode result = queryRange(1, 0, n - 1, 0, n - 1, minPrice, maxPrice);
        return result.count;
    }

    /**
     * Get min and max prices in range [l, r]
     */
    std::pair<int, int> getPriceRange(int l, int r) {
        if (n == 0 || l > r || l < 0 || r >= n) {
            return {INT_MAX, INT_MIN};
        }
        
        SegmentNode result = queryRange(1, 0, n - 1, l, r, INT_MIN, INT_MAX);
        return {result.minPrice, result.maxPrice};
    }

    /**
     * Update price at index
     */
    void updatePrice(int index, int newPrice) {
        if (index < 0 || index >= n) return;
        update(1, 0, n - 1, index, newPrice);
    }

    /**
     * Get current price at index
     */
    int getPrice(int index) const {
        if (index < 0 || index >= n) return -1;
        return prices[index];
    }

    /**
     * Get total number of products
     */
    int size() const {
        return n;
    }
};

/**
 * Export functions for Node.js binding
 */
extern "C" {
    SegmentTree* segment_tree_create(const int* prices, int size) {
        std::vector<int> priceVector(prices, prices + size);
        return new SegmentTree(priceVector);
    }

    int segment_tree_count_in_range(SegmentTree* tree, int minPrice, int maxPrice) {
        return tree->countInRange(minPrice, maxPrice);
    }

    void segment_tree_update_price(SegmentTree* tree, int index, int newPrice) {
        tree->updatePrice(index, newPrice);
    }

    int segment_tree_size(SegmentTree* tree) {
        return tree->size();
    }

    void segment_tree_destroy(SegmentTree* tree) {
        delete tree;
    }
}

// Example usage
#ifdef EASY11_CPP_TEST
int main() {
    std::cout << "=== Segment Tree Test ===" << std::endl;

    // Initialize with product prices
    std::vector<int> prices = {99, 149, 199, 249, 299, 349, 399, 449};
    SegmentTree tree(prices);

    std::cout << "Products: ";
    for (int price : prices) {
        std::cout << "$" << price << " ";
    }
    std::cout << std::endl << std::endl;

    // Test range queries
    std::cout << "Count products $100-$200: " << tree.countInRange(100, 200) << std::endl;
    std::cout << "Count products $250-$400: " << tree.countInRange(250, 400) << std::endl;
    std::cout << "Count products $0-$500: " << tree.countInRange(0, 500) << std::endl;
    std::cout << "Count products $150-$175: " << tree.countInRange(150, 175) << std::endl;

    // Get price range
    auto [minPrice, maxPrice] = tree.getPriceRange(0, 3);
    std::cout << "\nPrice range for first 4 products: $"
              << minPrice << " - $" << maxPrice << std::endl;

    // Update price
    std::cout << "\nUpdating price at index 2 from $" << tree.getPrice(2) << " to $179" << std::endl;
    tree.updatePrice(2, 179);

    std::cout << "Count products $150-$200 after update: " << tree.countInRange(150, 200) << std::endl;

    return 0;
}
#endif


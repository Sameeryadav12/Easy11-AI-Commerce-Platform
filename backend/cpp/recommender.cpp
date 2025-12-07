#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>
#include <random>
#include <map>
#include <queue>

/**
 * Sparse Matrix for efficient storage of user-item interactions
 * Only stores non-zero values
 */
class SparseMatrix {
private:
    std::map<std::pair<int, int>, double> data;
    int nRows;
    int nCols;

public:
    SparseMatrix(int rows, int cols) : nRows(rows), nCols(cols) {}

    void set(int row, int col, double value) {
        if (value != 0.0) {
            data[{row, col}] = value;
        } else {
            data.erase({row, col});
        }
    }

    double get(int row, int col) const {
        auto it = data.find({row, col});
        return (it != data.end()) ? it->second : 0.0;
    }

    bool hasValue(int row, int col) const {
        return data.find({row, col}) != data.end();
    }

    // Get all items rated by a user
    std::vector<int> getUserItems(int userId) const {
        std::vector<int> items;
        for (const auto& [key, value] : data) {
            if (key.first == userId) {
                items.push_back(key.second);
            }
        }
        return items;
    }

    // Get all users who rated an item
    std::vector<int> getItemUsers(int itemId) const {
        std::vector<int> users;
        for (const auto& [key, value] : data) {
            if (key.second == itemId) {
                users.push_back(key.first);
            }
        }
        return users;
    }

    int numRows() const { return nRows; }
    int numCols() const { return nCols; }
};

/**
 * ALS Recommender
 * Alternating Least Squares for collaborative filtering
 * 
 * Time Complexity: O(iterations * (|R| * k^2 + (n+m) * k^3))
 * where |R| = number of interactions, k = latent factors, n = users, m = items
 */
class ALSRecommender {
private:
    int nUsers;
    int nItems;
    int factors;
    double lambda;
    SparseMatrix R;
    
    std::vector<std::vector<double>> X;  // User embeddings [nUsers x factors]
    std::vector<std::vector<double>> Y;  // Item embeddings [nItems x factors]
    
    std::random_device rd;
    std::mt19937 gen;

    /**
     * Dot product of two vectors
     */
    double dotProduct(const std::vector<double>& a, const std::vector<double>& b) {
        double result = 0.0;
        for (size_t i = 0; i < a.size(); i++) {
            result += a[i] * b[i];
        }
        return result;
    }

    /**
     * Matrix multiplication: C = A * B
     */
    void matrixMultiply(const std::vector<std::vector<double>>& A,
                       const std::vector<std::vector<double>>& B,
                       std::vector<std::vector<double>>& C) {
        int rowsA = A.size();
        int colsA = A[0].size();
        int colsB = B[0].size();
        
        C.resize(rowsA, std::vector<double>(colsB, 0.0));
        
        for (int i = 0; i < rowsA; i++) {
            for (int j = 0; j < colsB; j++) {
                for (int k = 0; k < colsA; k++) {
                    C[i][j] += A[i][k] * B[k][j];
                }
            }
        }
    }

    /**
     * Matrix inverse (Gaussian elimination)
     */
    bool matrixInverse(const std::vector<std::vector<double>>& A, 
                      std::vector<std::vector<double>>& AInv) {
        int n = A.size();
        AInv = std::vector<std::vector<double>>(n, std::vector<double>(n, 0.0));
        
        // Create augmented matrix [A | I]
        std::vector<std::vector<double>> aug(2 * n, std::vector<double>(n, 0.0));
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                aug[i][j] = A[i][j];
            }
            aug[i][i + n] = 1.0;
        }
        
        // Gaussian elimination
        for (int i = 0; i < n; i++) {
            // Find pivot
            int maxRow = i;
            for (int k = i + 1; k < n; k++) {
                if (std::abs(aug[k][i]) > std::abs(aug[maxRow][i])) {
                    maxRow = k;
                }
            }
            std::swap(aug[i], aug[maxRow]);
            
            // Singular matrix
            if (std::abs(aug[i][i]) < 1e-9) {
                return false;
            }
            
            // Eliminate
            for (int k = i + 1; k < n; k++) {
                double factor = aug[k][i] / aug[i][i];
                for (int j = i; j < 2 * n; j++) {
                    aug[k][j] -= factor * aug[i][j];
                }
            }
        }
        
        // Back substitution
        for (int i = n - 1; i >= 0; i--) {
            for (int j = n; j < 2 * n; j++) {
                aug[i][j] /= aug[i][i];
            }
            for (int k = i - 1; k >= 0; k--) {
                for (int j = n; j < 2 * n; j++) {
                    aug[k][j] -= aug[k][i] * aug[i][j];
                }
            }
        }
        
        // Extract inverse
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                AInv[i][j] = aug[i][j + n];
            }
        }
        
        return true;
    }

public:
    ALSRecommender(int users, int items, int k = 10, double reg = 0.1)
        : nUsers(users), nItems(items), factors(k), lambda(reg), R(users, items), gen(rd()) {
        
        // Initialize embeddings randomly
        std::uniform_real_distribution<double> dis(-0.1, 0.1);
        X = std::vector<std::vector<double>>(nUsers, std::vector<double>(factors));
        Y = std::vector<std::vector<double>>(nItems, std::vector<double>(factors));
        
        for (int i = 0; i < nUsers; i++) {
            for (int j = 0; j < factors; j++) {
                X[i][j] = dis(gen);
            }
        }
        
        for (int i = 0; i < nItems; i++) {
            for (int j = 0; j < factors; j++) {
                Y[i][j] = dis(gen);
            }
        }
    }

    /**
     * Set user-item rating
     */
    void setRating(int userId, int itemId, double rating) {
        R.set(userId, itemId, rating);
    }

    /**
     * Train the model using alternating least squares
     */
    void train(int iterations = 10) {
        for (int iter = 0; iter < iterations; iter++) {
            // Optimize user embeddings
            for (int u = 0; u < nUsers; u++) {
                std::vector<int> items = R.getUserItems(u);
                if (items.empty()) continue;
                
                // Build YtY + λI
                std::vector<std::vector<double>> YtY(factors, std::vector<double>(factors, 0.0));
                for (int i = 0; i < factors; i++) {
                    YtY[i][i] = lambda;
                }
                for (int i : items) {
                    for (int f1 = 0; f1 < factors; f1++) {
                        for (int f2 = 0; f2 < factors; f2++) {
                            YtY[f1][f2] += Y[i][f1] * Y[i][f2];
                        }
                    }
                }
                
                // Build RY
                std::vector<double> RY(factors, 0.0);
                for (int i : items) {
                    double r_ui = R.get(u, i);
                    for (int f = 0; f < factors; f++) {
                        RY[f] += Y[i][f] * r_ui;
                    }
                }
                
                // Solve for X[u] = (YtY + λI)^(-1) * RY
                std::vector<std::vector<double>> YtYInv;
                if (matrixInverse(YtY, YtYInv)) {
                    for (int f = 0; f < factors; f++) {
                        X[u][f] = 0.0;
                        for (int k = 0; k < factors; k++) {
                            X[u][f] += YtYInv[f][k] * RY[k];
                        }
                    }
                }
            }
            
            // Optimize item embeddings
            for (int i = 0; i < nItems; i++) {
                std::vector<int> users = R.getItemUsers(i);
                if (users.empty()) continue;
                
                // Build XtX + λI
                std::vector<std::vector<double>> XtX(factors, std::vector<double>(factors, 0.0));
                for (int f = 0; f < factors; f++) {
                    XtX[f][f] = lambda;
                }
                for (int u : users) {
                    for (int f1 = 0; f1 < factors; f1++) {
                        for (int f2 = 0; f2 < factors; f2++) {
                            XtX[f1][f2] += X[u][f1] * X[u][f2];
                        }
                    }
                }
                
                // Build RX
                std::vector<double> RX(factors, 0.0);
                for (int u : users) {
                    double r_ui = R.get(u, i);
                    for (int f = 0; f < factors; f++) {
                        RX[f] += X[u][f] * r_ui;
                    }
                }
                
                // Solve for Y[i]
                std::vector<std::vector<double>> XtXInv;
                if (matrixInverse(XtX, XtXInv)) {
                    for (int f = 0; f < factors; f++) {
                        Y[i][f] = 0.0;
                        for (int k = 0; k < factors; k++) {
                            Y[i][f] += XtXInv[f][k] * RX[k];
                        }
                    }
                }
            }
        }
    }

    /**
     * Get top-K recommendations for a user
     */
    std::vector<std::pair<int, double>> recommend(int userId, int topK) {
        if (userId >= nUsers || userId < 0) {
            return {};
        }
        
        // Calculate scores for all items
        std::vector<std::pair<double, int>> scores;
        for (int i = 0; i < nItems; i++) {
            // Skip already rated items
            if (R.hasValue(userId, i)) {
                continue;
            }
            
            double score = dotProduct(X[userId], Y[i]);
            scores.push_back({score, i});
        }
        
        // Use min-heap to find top-K
        std::priority_queue<std::pair<double, int>,
                           std::vector<std::pair<double, int>>,
                           std::greater<std::pair<double, int>>> heap;
        
        for (const auto& [score, itemId] : scores) {
            if (heap.size() < topK) {
                heap.push({score, itemId});
            } else if (score > heap.top().first) {
                heap.pop();
                heap.push({score, itemId});
            }
        }
        
        // Extract results
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

/**
 * Export functions for Node.js binding
 */
extern "C" {
    ALSRecommender* als_create(int nUsers, int nItems, int factors, double lambda) {
        return new ALSRecommender(nUsers, nItems, factors, lambda);
    }

    void als_set_rating(ALSRecommender* als, int userId, int itemId, double rating) {
        als->setRating(userId, itemId, rating);
    }

    void als_train(ALSRecommender* als, int iterations) {
        als->train(iterations);
    }

    void als_recommend(ALSRecommender* als, int userId, int topK, 
                      std::vector<std::pair<int, double>>& results) {
        results = als->recommend(userId, topK);
    }

    void als_destroy(ALSRecommender* als) {
        delete als;
    }
}

// Example usage
#ifdef EASY11_CPP_TEST
int main() {
    std::cout << "=== ALS Recommender Test ===" << std::endl;

    int nUsers = 5;
    int nItems = 10;
    int factors = 3;
    
    ALSRecommender recommender(nUsers, nItems, factors, 0.1);
    
    // Add some ratings
    recommender.setRating(0, 0, 5.0);
    recommender.setRating(0, 1, 4.0);
    recommender.setRating(0, 2, 5.0);
    recommender.setRating(1, 1, 3.0);
    recommender.setRating(1, 2, 4.0);
    recommender.setRating(1, 3, 5.0);
    recommender.setRating(2, 0, 4.0);
    recommender.setRating(2, 3, 5.0);
    recommender.setRating(2, 4, 3.0);
    
    // Train model
    std::cout << "Training ALS model..." << std::endl;
    recommender.train(10);
    
    // Get recommendations
    std::cout << "\nTop-3 recommendations for user 0:" << std::endl;
    auto recs = recommender.recommend(0, 3);
    for (const auto& [itemId, score] : recs) {
        std::cout << "  Item " << itemId << ": score = " << score << std::endl;
    }
    
    std::cout << "\nTop-3 recommendations for user 1:" << std::endl;
    recs = recommender.recommend(1, 3);
    for (const auto& [itemId, score] : recs) {
        std::cout << "  Item " << itemId << ": score = " << score << std::endl;
    }

    return 0;
}
#endif


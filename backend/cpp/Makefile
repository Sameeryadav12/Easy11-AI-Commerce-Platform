CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -O3 -fPIC
BUILD_DIR = build
TEST_DIR = test

# Source files
SOURCES = search.cpp cache.cpp segment_tree.cpp recommender.cpp
OBJECTS = $(SOURCES:%.cpp=$(BUILD_DIR)/%.o)

# Test executables
TEST_SOURCES = $(SOURCES)
TEST_EXECUTABLES = $(TEST_SOURCES:%.cpp=$(BUILD_DIR)/test_%)

.PHONY: all clean test

# Build all modules as object files
all: $(BUILD_DIR) $(OBJECTS)

# Create build directory
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

# Compile source files
$(BUILD_DIR)/%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Compile with test definitions
$(BUILD_DIR)/test_%: %.cpp
	$(CXX) $(CXXFLAGS) -DEASY11_CPP_TEST -o $@ $<

# Run all tests
test: $(TEST_EXECUTABLES)
	@echo "Running C++ unit tests..."
	@for test in $(TEST_EXECUTABLES); do \
		echo "Running $$test..."; \
		./$$test || exit 1; \
	done
	@echo "All tests passed!"

# Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)
	rm -f *.o *.so *.a

# Create shared library (for Node-API integration)
lib: $(BUILD_DIR) $(OBJECTS)
	$(CXX) $(CXXFLAGS) -shared -o $(BUILD_DIR)/easy11_optimization.so $(OBJECTS)

# Install (for Node-API binding)
install: lib
	@echo "Library built: $(BUILD_DIR)/easy11_optimization.so"


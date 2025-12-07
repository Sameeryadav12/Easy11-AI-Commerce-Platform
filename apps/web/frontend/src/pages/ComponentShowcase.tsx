import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Badge,
  Modal,
  ModalFooter,
  Loading,
  Skeleton,
} from '../components/ui';

/**
 * Component Showcase Page
 * 
 * Demonstrates all UI components in the Easy11 design system.
 * Useful for development, testing, and design review.
 */
export const ComponentShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-heading font-bold text-navy dark:text-white mb-4">
            Easy11 Component Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore all available UI components and their variants
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-6">Buttons</h2>
          <Card>
            <CardBody>
              <div className="space-y-6">
                {/* Button Variants */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Variants
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                {/* Button Sizes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* Button States */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    States
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button isLoading>Loading</Button>
                    <Button disabled>Disabled</Button>
                    <Button fullWidth>Full Width</Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader>
                <h3 className="text-xl font-semibold">Default Card</h3>
              </CardHeader>
              <CardBody>
                This is a default card with subtle shadow and border.
              </CardBody>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-xl font-semibold">Elevated Card</h3>
              </CardHeader>
              <CardBody>
                This card has a more prominent shadow for emphasis.
              </CardBody>
            </Card>

            <Card variant="outlined" hover>
              <CardHeader>
                <h3 className="text-xl font-semibold">Outlined Card</h3>
              </CardHeader>
              <CardBody>
                This card has an outline and hover effect.
              </CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-6">Inputs</h2>
          <Card>
            <CardBody>
              <div className="space-y-6 max-w-md">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
                <Input
                  label="With Error"
                  placeholder="Invalid input"
                  error="This field is required"
                />
                <Input
                  label="With Helper Text"
                  placeholder="Username"
                  helperText="Choose a unique username"
                />
                <Input
                  label="Disabled"
                  placeholder="Disabled input"
                  disabled
                />
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-6">Badges</h2>
          <Card>
            <CardBody>
              <div className="space-y-6">
                {/* Badge Variants */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Variants
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="default">Default</Badge>
                  </div>
                </div>

                {/* Badge Sizes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge size="sm" variant="success">Small</Badge>
                    <Badge size="md" variant="success">Medium</Badge>
                    <Badge size="lg" variant="success">Large</Badge>
                  </div>
                </div>

                {/* Practical Examples */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Practical Examples
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="success">In Stock</Badge>
                    <Badge variant="warning">Low Stock</Badge>
                    <Badge variant="danger">Out of Stock</Badge>
                    <Badge variant="info">New Arrival</Badge>
                    <Badge variant="default">Best Seller</Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Modal Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-6">Modal</h2>
          <Card>
            <CardBody>
              <Button onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </CardBody>
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This is a modal dialog with a title, content, and action buttons.
              Press ESC or click outside to close.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Modals are great for forms, confirmations, and focused interactions.
            </p>
            <ModalFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>
        </section>

        {/* Loading Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-semibold mb-6">Loading States</h2>
          <Card>
            <CardBody>
              <div className="space-y-8">
                {/* Spinner Sizes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Spinner Sizes
                  </h3>
                  <div className="flex flex-wrap items-center gap-8">
                    <Loading size="sm" />
                    <Loading size="md" />
                    <Loading size="lg" />
                    <Loading size="xl" />
                  </div>
                </div>

                {/* With Text */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    With Text
                  </h3>
                  <Loading size="md" text="Loading..." />
                </div>

                {/* Skeleton Loaders */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Skeleton Loaders
                  </h3>
                  <div className="space-y-3 max-w-md">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-4">
                      <Skeleton variant="circular" className="h-12 w-12" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Screen Loading */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Full Screen Loading
                  </h3>
                  <Button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 2000);
                    }}
                  >
                    Show Full Screen Loader
                  </Button>
                  {isLoading && (
                    <Loading fullScreen size="lg" text="Please wait..." />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Easy11 Design System • Built with React + TypeScript + TailwindCSS</p>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcase;


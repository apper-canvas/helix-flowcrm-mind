import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <ApperIcon name="AlertTriangle" className="w-24 h-24 text-warning mx-auto" />
        </motion.div>

        <Text as="h1" className="text-4xl font-bold text-surface-900 mb-4">404 - Page Not Found</Text>
        <Text as="p" className="text-surface-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </Text>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 bg-transparent"
          >
            Go Back
          </Button>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white hover:bg-primary-700"
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
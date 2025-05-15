/**
 * API service for handling data fetching
 */

// Mock data for development
const bannerImages = [
  { id: 1, image: '/static/images/banner1.jpg' },
  { id: 2, image: '/static/images/banner2.jpg' },
  { id: 3, image: '/static/images/banner3.jpg' },
];

const materialCategories = [
  { 
    id: 1, 
    title: '900×1800', 
    image: '/static/images/category1.jpg',
    materials: [
      { id: 'SJ9809L0048Q', name: '潘多拉玉', size: '900×1800mm', thickness: '9mm', finish: '亮面', code: 'SJ9809L0048Q-ABC', image: '/static/images/material1.jpg', categories: ['二类色'] },
      { id: 'M918022', name: '白雪公主', size: '900×1800mm', thickness: '9mm', finish: '亮面', code: 'M918022-ABC', image: '/static/images/material2.jpg', categories: ['一类色'] },
      { id: 'M91803', name: '挪威', size: '900×1800mm', thickness: '9mm', finish: '亮面', code: 'M91803-ABC', image: '/static/images/material3.jpg', categories: ['一类色'] },
      { id: 'M91820', name: '温德姆灰', size: '900×1800mm', thickness: '9mm', finish: '亮面', code: 'M91820-ABC', image: '/static/images/material4.jpg', categories: ['二类色'] },
    ]
  },
  { 
    id: 2, 
    title: '800×2600', 
    image: '/static/images/category2.jpg',
    materials: [
      { id: 'SJ8026L001', name: '爵士白', size: '800×2600mm', thickness: '9mm', finish: '亮面', code: 'SJ8026L001-ABC', image: '/static/images/material5.jpg', categories: ['一类色'] },
      { id: 'SJ8026L002', name: '卡拉拉白', size: '800×2600mm', thickness: '9mm', finish: '亮面', code: 'SJ8026L002-ABC', image: '/static/images/material6.jpg', categories: ['一类色'] },
    ]
  },
  { 
    id: 3, 
    title: '9mm亮光', 
    image: '/static/images/category3.jpg',
    materials: [
      { id: 'SJ9809L0048Q', name: '潘多拉玉', size: '900×1800mm', thickness: '9mm', finish: '亮面', code: 'SJ9809L0048Q-ABC', image: '/static/images/material1.jpg', categories: ['二类色'] },
      { id: 'M918022', name: '白雪公主', size: '900×1800mm', thickness: '9mm', finish: '亮面', code: 'M918022-ABC', image: '/static/images/material2.jpg', categories: ['一类色'] },
    ]
  },
  { 
    id: 4, 
    title: '哑光/肌肤釉', 
    image: '/static/images/category4.jpg',
    materials: [
      { id: 'SJ9809M001', name: '灰玉', size: '900×1800mm', thickness: '9mm', finish: '哑光', code: 'SJ9809M001-ABC', image: '/static/images/material7.jpg', categories: ['二类色'] },
      { id: 'SJ9809M002', name: '金花米黄', size: '900×1800mm', thickness: '9mm', finish: '哑光', code: 'SJ9809M002-ABC', image: '/static/images/material8.jpg', categories: ['一类色'] },
    ]
  },
];

const companyInfo = {
  name: '岩板选材中心',
  description: '我们专注于提供高品质的岩板材料，为您的家居装修提供专业选择。多年来，我们一直致力于寻找最优质的岩板产品，确保每一位客户都能获得满意的选择。',
  address: '广东省佛山市南海区XXX工业区',
  phone: '0757-88888888',
  email: 'contact@yuhaoshiye.com',
  website: 'www.yuhaoshiye.com'
};

/**
 * Get banner images
 * @returns {Promise} Promise object representing banner images
 */
export const getBanners = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bannerImages);
    }, 300);
  });
};

/**
 * Get material categories
 * @returns {Promise} Promise object representing material categories
 */
export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(materialCategories);
    }, 300);
  });
};

/**
 * Get materials by category ID
 * @param {Number} categoryId - Category ID
 * @returns {Promise} Promise object representing materials
 */
export const getMaterialsByCategory = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const category = materialCategories.find(c => c.id === categoryId);
      resolve(category ? category.materials : []);
    }, 300);
  });
};

/**
 * Get material by ID
 * @param {String} materialId - Material ID
 * @returns {Promise} Promise object representing material
 */
export const getMaterialById = (materialId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let foundMaterial = null;
      materialCategories.forEach(category => {
        const material = category.materials.find(m => m.id === materialId);
        if (material) {
          foundMaterial = material;
        }
      });
      resolve(foundMaterial);
    }, 300);
  });
};

/**
 * Search materials
 * @param {String} keyword - Search keyword
 * @param {Array} filters - Optional array of filter strings to apply
 * @returns {Promise} Promise object representing search results
 */
export const searchMaterials = (keyword, filters = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!keyword && filters.length === 0) {
        resolve([]);
        return;
      }
      
      // Get all materials from all categories
      let allMaterials = [];
      materialCategories.forEach(category => {
        allMaterials = [...allMaterials, ...category.materials];
      });
      
      // Remove duplicates (materials that appear in multiple categories)
      allMaterials = allMaterials.filter((material, index, self) => 
        index === self.findIndex(m => m.id === material.id)
      );
      
      // Filter by keyword
      let results = allMaterials;
      
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        results = results.filter(material => 
          material.name.toLowerCase().includes(lowerKeyword) ||
          material.code.toLowerCase().includes(lowerKeyword) ||
          material.categories.some(cat => cat.toLowerCase().includes(lowerKeyword)) ||
          material.finish.toLowerCase().includes(lowerKeyword) ||
          material.size.toLowerCase().includes(lowerKeyword)
        );
      }
      
      // Apply additional filters
      if (filters && filters.length > 0) {
        results = results.filter(material => {
          // Check if material matches any of the filters
          return filters.some(filter => {
            const lowerFilter = filter.toLowerCase();
            return (
              material.finish.toLowerCase().includes(lowerFilter) ||
              material.categories.some(cat => cat.toLowerCase().includes(lowerFilter)) ||
              material.size.toLowerCase().includes(lowerFilter)
            );
          });
        });
      }
      
      resolve(results);
    }, 600);
  });
};

/**
 * Get company information
 * @returns {Promise} Promise object representing company information
 */
export const getCompanyInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(companyInfo);
    }, 300);
  });
};

export default {
  getBanners,
  getCategories,
  getMaterialsByCategory,
  getMaterialById,
  searchMaterials,
  getCompanyInfo
}; 
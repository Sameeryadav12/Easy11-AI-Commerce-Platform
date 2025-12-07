"""
Apache Superset Configuration for Easy11
"""

import os
from flask_appbuilder.security.manager import AUTH_OID, AUTH_OAUTH

# Database configuration
SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL',
    'postgresql+psycopg2://postgres:postgres@postgres:5432/easy11_dev'
)

# Redis cache
CACHE_CONFIG = {
    'CACHE_TYPE': 'RedisCache',
    'CACHE_DEFAULT_TIMEOUT': 300,
    'CACHE_KEY_PREFIX': 'superset_',
    'CACHE_REDIS_HOST': os.getenv('REDIS_HOST', 'redis'),
    'CACHE_REDIS_PORT': int(os.getenv('REDIS_PORT', 6379)),
    'CACHE_REDIS_DB': 1,
}

# Secret key
SECRET_KEY = os.getenv('SUPERSET_SECRET_KEY', 'changeme')

# OAuth/OIDC Configuration
AUTH_TYPE = AUTH_OAUTH

# Keycloak OIDC Configuration
OAUTH_PROVIDERS = [
    {
        'name': 'keycloak',
        'icon': 'fa-key',
        'token_key': 'access_token',
        'remote_app': {
            'client_id': os.getenv('AUTH_CLIENT_ID', ''),
            'client_secret': os.getenv('AUTH_CLIENT_SECRET', ''),
            'api_base_url': os.getenv('AUTH_ISSUER', ''),
            'client_kwargs': {
                'scope': 'openid email profile roles'
            },
            'access_token_url': f"{os.getenv('AUTH_ISSUER', '')}/protocol/openid-connect/token",
            'authorize_url': f"{os.getenv('AUTH_ISSUER', '')}/protocol/openid-connect/auth",
            'request_token_url': None,
        }
    }
]

# Role mapping
AUTH_ROLE_ADMIN = 'Admin'
AUTH_ROLE_PUBLIC = 'Public'

# Map Keycloak roles to Superset roles
AUTH_USER_REGISTRATION = True
AUTH_USER_REGISTRATION_ROLE = 'Public'

def oauth_user_info_getter(sm, provider, response=None):
    """Custom user info getter for Keycloak"""
    if provider == 'keycloak':
        me = sm.oauth_remotes[provider].get('userinfo').json()
        
        # Extract roles
        roles = me.get('realm_access', {}).get('roles', [])
        
        # Determine Superset role
        if 'admin' in roles:
            role = 'Admin'
        elif 'analyst' in roles:
            role = 'Alpha'  # Can modify dashboards
        else:
            role = 'Gamma'  # Read-only
            
        return {
            'username': me['preferred_username'],
            'email': me['email'],
            'first_name': me.get('given_name', ''),
            'last_name': me.get('family_name', ''),
            'role_keys': [role]
        }

# Security
WTF_CSRF_ENABLED = True
WTF_CSRF_EXEMPT_LIST = []
WTF_CSRF_TIME_LIMIT = None

# Enable embedding in iframes (for Admin Portal)
HTTP_HEADERS = {
    'X-Frame-Options': 'SAMEORIGIN'
}

# Guest token configuration for embedding
GUEST_TOKEN_JWT_SECRET = os.getenv('SUPERSET_JWT_SECRET', SECRET_KEY)
GUEST_TOKEN_JWT_ALGO = 'HS256'
GUEST_TOKEN_JWT_EXP_SECONDS = 300  # 5 minutes

# Row Level Security
ENABLE_ROW_LEVEL_SECURITY = True

# Feature flags
FEATURE_FLAGS = {
    'DASHBOARD_NATIVE_FILTERS': True,
    'DASHBOARD_CROSS_FILTERS': True,
    'DASHBOARD_RBAC': True,
    'EMBEDDED_SUPERSET': True,
    'ENABLE_TEMPLATE_PROCESSING': True,
}

# Data upload
UPLOAD_FOLDER = '/app/superset_home/uploads/'
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}

# Async query configuration
SQLLAB_ASYNC_TIME_LIMIT_SEC = 300
SQL_MAX_ROW = 100000

# Logging
LOG_FORMAT = '%(asctime)s:%(levelname)s:%(name)s:%(message)s'
LOG_LEVEL = 'INFO'


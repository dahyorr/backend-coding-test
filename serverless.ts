import type { AWS } from '@serverless/typescript';

import signup from '@functions/signup';
import login from '@functions/login';
import createBlogPost from '@functions/createBlogPost';
import listBlogPosts from '@functions/listBlogPosts';
import retrieveBlogPost from '@functions/retrieveBlogPost';
import searchBlogPost from '@functions/searchBlogPost';
import updateBlogPost from '@functions/updateBlogPost';
import deleteBlogPost from '@functions/deleteBlogPost';

const serverlessConfiguration: AWS = {
  service: 'backend-coding-test',
  variablesResolutionMode: "20210326",
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    region: 'us-east-2',
    runtime: 'nodejs14.x',
    stage: 'prod',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      HASURA_ADMIN_SECRET: "${ssm:HASURA_ADMIN_SECRET}",
      FIREBASE_API_KEY: "${ssm:FIREBASE_API_KEY}"
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    signup,
    login, 
    createBlogPost, 
    listBlogPosts, 
    retrieveBlogPost, 
    searchBlogPost,
    updateBlogPost,
    deleteBlogPost 
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  useDotenv: true,
};

module.exports = serverlessConfiguration;

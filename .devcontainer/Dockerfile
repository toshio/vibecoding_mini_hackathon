FROM mcr.microsoft.com/devcontainers/javascript-node:24
USER node
RUN npm config set prefix '/home/node/.npm-global'
ENV PATH="/home/node/.npm-global/bin:$PATH"
RUN npm install -g @google/gemini-cli

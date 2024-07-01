#!/usr/bin/env bash

# 碰见错误自动退出脚本 不继续进行
set -e

# 常量定义位置
## lcp-web
LCPWEB_DIRNAME=lcp-web
LCPWEB_NODE_VERSION=14.21.3
## lcp_web_upgrade
LCPWEBUPGRADE=lcp_web_upgrade
LCPWEBUPGRADE_NODE_VERSION=16.20.0


## 环境变量
BUILD_TYPE= # 打包形式 等待用户输入后确认
## 工作路径 编辑器 管理端 部署端 共同父目录路径
CURRENT_DIR=$PWD
echo "---- 当前目录 ${CURRENT_DIR} ----"

# shellcheck disable=SC2155
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

export NODE_OPTIONS=--max-old-space-size=4096

echo "lcp-web：NODE版本${LCPWEB_NODE_VERSION}"
echo "lcp_web_upgrade：NODE版本${LCPWEBUPGRADE_NODE_VERSION}"

# 选择打包形式
chooseBuild() {
  echo "请输入数字选择打包形式："
  options=("打包lcp-web" "打包lcp_web_upgrade" "先打包lcp-web然后打包lcp_web_upgrade" "退出")
  select option in "${options[@]}"; do
    case $REPLY in
    1)
      echo "选择了--- ${option}"
      BUILD_TYPE=$REPLY
      break
      ;;
    2)
      echo "选择了--- ${option}"
      BUILD_TYPE=$REPLY
      break
      ;;
    3)
      echo "选择了--- ${option}"
      BUILD_TYPE=$REPLY
      break
      ;;
    4)
      echo "选择了--- ${option}"
      echo "退出"
      exit 0
      ;;
    *)
      echo "选择错误,你在好好想想"
      continue
      ;;
    esac
  done
}

buildLcpWeb() {
  local git_url
  local has_path
  local node_version
  echo '尝试打开lcp-web文件夹'
  cd "$CURRENT_DIR" || exit 1
  echo "---- lcp-web打包路径 $CURRENT_DIR ----"
  echo "---- 检测lcp-web git 地址"
  # 检测代码路径
  git_url=$(git remote -v)
  has_path=$(echo "$git_url" | grep "lcp-saas/lcp-web.git")
  if [[ $has_path != "" ]]; then
    echo "---- 检测lcp-web git 地址 通过"
  else
    echo "eeee lcp-web路径错误"
    exit 1
  fi
  echo "---- 切换 Nodejs 版本"
  nvm use $LCPWEB_NODE_VERSION
  node_version=$(node -v)
  echo "---- 当前Node版本 $node_version ----"
  echo "请输入需要打包的分支名称："
  read lcp_web_branch_name
  echo "即将要打包的分支为:$lcp_web_branch_name"
  echo '切换分支'
  git checkout $lcp_web_branch_name
  echo '拉取代码'
  git pull
  git branch

  read -p "是否需要重新下载依赖 y/n: " -t 30 downLoadY
     if [ "y" = $downLoadY ]
    then
    echo "--- 开始下载依赖 ---"
      npm ci
    fi
  echo "--- 开始构建 ---"
  npm run build:national
}

buildLcpWebUpgrade () {
 local git_url
  local has_path
  local node_version
  echo '尝试打开lcp_web_upgrade文件夹'
  cd "$CURRENT_DIR/applications/lcp_web_upgrade" || exit 1
  echo "---- lcp_web_upgrade打包路径 $CURRENT_DIR/applications/lcp_web_upgrade ----"
  echo "---- 检测lcp_web_upgrade git 地址"
  # 检测代码路径
  git_url=$(git remote -v)
  has_path=$(echo "$git_url" | grep "lcp-saas/lcp_web_upgrade.git")
  if [[ $has_path != "" ]]; then
    echo "---- 检测lcp_web_upgrade git 地址 通过"
  else
    echo "eeee lcp_web_upgrade路径错误"
    exit 1
  fi
  echo "---- 切换 Nodejs 版本"
  nvm use $LCPWEBUPGRADE_NODE_VERSION
  node_version=$(node -v)
  echo "---- 当前Node版本 $node_version ----"

  echo "请输入需要打包的分支名称："
  read lcp_web_upgrade_branch_name
  echo "即将要打包的分支为:$lcp_web_upgrade_branch_name"
  echo '切换分支'
  git checkout $lcp_web_upgrade_branch_name
  echo '拉取代码'
  git pull
  git branch

  read -p "是否需要重新下载依赖 y/n: " -t 30 downLoadT
     if [ "y" = $downLoadT ]
    then
    echo "--- 开始下载依赖 ---"
      npm ci
    fi

  echo "--- 开始构建 ---"
  npm run build
  echo "--- 删除dist/lcp_web_upgrade文件 ---"
  rm -rf "$CURRENT_DIR/dist/lcp_web_upgrade"
  echo "---- 拷贝dist/lcp_web_upgrade文件 ----"
  cp -R "$CURRENT_DIR/applications/lcp_web_upgrade/dist/lcp_web_upgrade" "$CURRENT_DIR/dist/lcp_web_upgrade"
  echo "--- lcp_web_upgrade 拷贝完成 ---"
}

mainFunc () {
  chooseBuild
  echo "---- 打包值： ${BUILD_TYPE} ----"
  if ((BUILD_TYPE == 1))
  then
    buildLcpWeb
  elif ((BUILD_TYPE == 2))
  then
    buildLcpWebUpgrade
  elif ((BUILD_TYPE == 3))
  then
    buildLcpWeb
    buildLcpWebUpgrade
  else
      echo "eeee 打包形式 错误 eeee"
  fi
}


pushCode() {
  echo '即将push lcp-web项目的代码'
    read -p "请确认是否推送lcp-web项目代码到远程仓库 y/n: " -t 30 resultT
     if [ "n" = $resultT ]
    then
      exit 0;
    fi
  cd "$CURRENT_DIR" || exit 1

  echo "请输入需要部署的分支名称："
    read branch_name

  echo '切换分支'
  git checkout $branch_name

  echo '拉取代码'
  git pull
  git branch
  echo "推送分支为:$branch_name"
  git pull
  echo "日志：开始提交代码"
  git add .
  git commit -m "chore: update dist"
  git push origin $branch_name:$branch_name
  echo "日志：代码提交完成"
}

mainFunc
pushCode

exit 0;

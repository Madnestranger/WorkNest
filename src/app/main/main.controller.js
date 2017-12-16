export class MainController {
  constructor($timeout, $scope) {
    'ngInject';
    this.$timeout = $timeout;
    this.$scope = $scope;
    this.items = [];
    this.resetConfig();
    this.searchTerm = 'Copter';
    this.loadImages();
  }

  resetConfig() {
    this.postsConfig = {
      threeshold: 9,
      lastAfter: '',
      currentPage: 1,
      totalPagesDownloaded: 0,
      canUploadNew: true,
      showErrorMessage: false
    };
    this.items.length = 0;
  }


  showErrorMessage() {
    this.postsConfig.showErrorMessage = true;
    this.$timeout(() => {
      this.postsConfig.showErrorMessage = false;
    }, 4000);
  }

  loadImages(ev) {
    if (ev) ev.preventDefault();
    this.postsConfig.canUploadNew = false;
    let self = this; // to avoid closure
    reddit.search(this.searchTerm).t('all').limit(this.postsConfig.threeshold).after(this.postsConfig.lastAfter).sort("hot").fetch(res => {
      if (res.data.children.length === 0 || res.data.children.length < (this.postsConfig.threeshold - 1)) {
        this.postsConfig.currentPage--;
        this.$scope.$apply();
        this.showErrorMessage();
        return;
      }
      this.postsConfig.lastAfter = res.data.after;
      self.items = self.items.concat(res.data.children.map(function (item) {
        return {
          image: item.data.thumbnail && item.data.thumbnail.indexOf('http') !== -1 ? item.data.thumbnail : 'assets/images/Nopic.png',
          title: item.data.title
        }
      }));
      this.postsConfig.canUploadNew = true;
      this.postsConfig.totalPagesDownloaded++;
      this.$scope.$apply();
    });
  }

  goToFirstPage() {
    this.postsConfig.currentPage = 1;
  }

  goToLastPage() {
    this.postsConfig.currentPage = angular.copy(this.postsConfig.totalPagesDownloaded);
  }

  nextPage() {
    this.postsConfig.currentPage++;
    if (this.postsConfig.currentPage > this.postsConfig.totalPagesDownloaded) {
      this.loadImages();
    }
  }

  previousPage() {
    this.postsConfig.currentPage--;
  }

}

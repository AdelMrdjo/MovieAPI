var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
	$scope.limit = 6;
	$scope.randomSelectID = 0;
	$scope.genreDialog = false;
	$scope.randomDialog = false;
	$scope.animSpinner = false;
  	$http.get("https://api.themoviedb.org/3/movie/popular?api_key=95c61f74b09a83612c9177b0212c441f&language=en-US&page=1")
  		.then(function(response) {
      		$scope.myWelcome = response.data;

      		$scope.refreshPagination = (page) =>{ // New page,refresh our pagination
      			$scope.currentPage = page;
      			if($scope.currentPage > 0 && $scope.currentPage < 4){
	      			$scope.pg1 = 1;
	      			$scope.pg2 = 2;
	      			$scope.pg3 = 3;
	      			$scope.pg4 = 4;
	      			$scope.pg5 = 5;
	      		}else{
	      			$scope.pg1 = $scope.currentPage-2;
	      			$scope.pg2 = $scope.currentPage-1;
	      			$scope.pg3 = $scope.currentPage;
	      			$scope.pg4 = $scope.currentPage+1;
	      			$scope.pg5 = $scope.currentPage+2;
	      		}
      		}
      		$scope.currentPage = 1;
      		$scope.refreshPagination($scope.currentPage);
      		$scope.newPage = (page) =>{ // New page,new content
      			$scope.limit = 6;
      			$scope.currentPage = page;
      			$scope.refreshPagination($scope.currentPage);
      			$http.get(`https://api.themoviedb.org/3/movie/popular?api_key=95c61f74b09a83612c9177b0212c441f&language=en-US&page=${page}`)
  				.then(function(response) {
      					$scope.myWelcome = response.data;
      			});
      		}
			$scope.setRate = (star) =>{ // Function for setting the rating on a movie
				localStorage.setItem($scope.oneVideo.id,star);
				$(".stars i").css("color","#c7c7c7");
				for(var k=1;k<=star;k++){
					$(`.stars i:nth-child(${k})`).css("color","#03a9f4");
				}
			}
  			$scope.getAllGenres = () =>{ // Function for getting all genres
  				$http.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=95c61f74b09a83612c9177b0212c441f&language=en-US`)
  				.then(function(response) {
  					$scope.genres = response.data.genres;
  				}
  			);
  			$scope.randomBack = () =>{ // Return to all genres (random movie -> all genres)
  				$scope.randomDialog = false;
  				$scope.genreDialog = true;
  			}
  			$scope.refreshRandomMovie = () =>{ // Refresh random movie
  				$scope.randomMovie($scope.randomSelectID,$scope.randomSelectGenr);
  			}
  			$scope.randomMovie = (id,genr) =>{ // Getting random movie
  				$scope.genreDialog = false;
  				$scope.animSpinner = true;
  				$scope.randomDialog = false;
  				$scope.randomSelectID = id;
  				$scope.randomSelectGenr = genr;
  				let randomTo20 = Math.floor((Math.random() * 20) + 1); // We have 20 movies per page
  				let randomTo500 = Math.floor((Math.random() * 500) + 1); // We have 500 pages per genre
  				$http.get(`https://api.themoviedb.org/3/discover/movie?api_key=95c61f74b09a83612c9177b0212c441f&with_genres=${id}&page=${randomTo500}`)
  				.then(function(response) {
  					$scope.randomMovieInfo = response.data.results[randomTo20];
  					if(response.data.results[randomTo20].poster_path == null) $scope.randomImage = false; // Some movies don't have a picture, we don't need an error
            else $scope.randomImage = true;
  					$scope.randomMovieInfo.release_date = $scope.giveMeOnlyYear(response.data.results[randomTo20].release_date);
  					$scope.animSpinner = false;
  					$scope.randomDialog = true;
  				})
  				.catch(() => { // error? refresh random movie... (three or four movie genres have less than 500 pages (as I defined),prevent it)
  					$scope.randomMovie($scope.randomSelectID,$scope.randomSelectGenr);
				});
  			}
  	}
  	$scope.getAllGenres();
  	});
  	$scope.readMore = (id) =>{ // Getting more information about the movie on the left side
  		$scope.animSpinner = true;
  		if($(".rouletteModal").css("opacity") == 1) $(".rouletteModal").animate({left:'-50%',opacity:'0'},"normal",function(){
  			$(".rouletteModal").css("left","150%");
  		});
  		$http.get(`https://api.themoviedb.org/3/movie/${id}?api_key=95c61f74b09a83612c9177b0212c441f&language=en-US`)
  		.then(function(response) {
  			$scope.animSpinner = false;
      		$scope.oneVideo = response.data;
      		$scope.oneVideo.release_date = $scope.giveMeOnlyYear(response.data.release_date);
      		if($(".movieInfo").width() == 0) $(".movieInfo").animate({width: '350px'},"fast");
      		$(".stars i").css("color","#c7c7c7");
			for(var k=1;k<=localStorage.getItem(id);k++){
				$(`.stars i:nth-child(${k})`).css("color","#03a9f4");
			}
  		});
  	}
  	$scope.giveMeOnlyYear = (date) =>{ // Formating date, returning only year
  		var res = date.split("-");
  		return res[0];
  	}
  	$scope.closeTab = () =>{ // Close left tab with movie information
  		$(".movieInfo").animate({width: '0px'},"fast");
  	}
  	$scope.loadMore = () =>{ // Load other movies on the current page
  		$scope.limit = 20;
  	}
  	$scope.showRoulette = () => { // Show me roulette modal
  		$scope.genreDialog = true;
  		$scope.randomDialog = false;
  		if($(".movieInfo").width() > 300) $(".movieInfo").animate({width: '0px'},"fast");
  		$(".rouletteModal").animate({left:'50%',opacity:'1'},"normal");
  	}
  	$scope.closeRoulette = () => { // Close roulette modal
  		$scope.genreDialog = true;
  		$scope.randomDialog = false;
  		$scope.animSpinner = false;
  		$(".rouletteModal").animate({left:'-50%',opacity:'0'},"normal",function(){
  			$(".rouletteModal").css("left","150%");
  		});
  	}
});
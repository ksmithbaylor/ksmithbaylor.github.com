---
layout: post
title: Birthday Paradox in Clojure
tags: [clojure]
modified: 2015-07-18
comments: true
---

I read something today about the [Birthday Paradox](https://en.wikipedia.org/wiki/Birthday_problem) that said that if there are 23 people in a room together, there is a 50% chance of two or more of them sharing the same birthday. I thought this might make a nice coding illustration, so I implemented it in Clojure:

{% highlight clojure %}
(defn random-birthdays [num-people]
  (map rand-int (repeat num-people 365)))

(defn duplicates? [birthdays]
  (> (count birthdays)
     (count (set birthdays))))

(defn simulate [num-people]
  (duplicates? (random-birthdays num-people)))

(defn run-simulation [num-people num-trials]
  (let [setup (repeat num-trials num-people)
        results (map simulate setup)
        num-shared (count (filter identity results))]
    (/ num-shared
       (float num-trials))))
{% endhighlight %}

I'm going to walk through the code step-by-step and show how it works.

## Walkthrough

We have a `random-birthdays` function that just generates a list of `num-people` random numbers by first making a list of length `num-people` where all the members are `365`. If `num-people` were `5`, the process would be:

{% highlight clojure %}
user=> (repeat num-people 365)
(365 365 365 365 365)
user=> (map rand-int *1) ; Remember, *1 refers to the previous REPL result
(17 310 56 109 49)
{% endhighlight %}

Next, we have a `duplicates?` function that takes a list of birthdays
and returns whether or not there are any duplicates. It makes a set out of the
list of birthdays, which removes any duplicates, and then checks whether its
length is less than the length of the original list.

{% highlight clojure %}
user=> (duplicates? [1 2 2 3])
true
user=> (duplicates? [1 2 3 4])
false
{% endhighlight %}

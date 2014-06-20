# Copyright 2014 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Module to redirect /* to /"""

__author__ = 'nivco@google.com (Nicolas Garnier)'

import webapp2


class DefaultHandler(webapp2.RequestHandler):
  """Handler redirecting /* to /"""

  def get(self):
    """Redirect to / and keeping the URL parameters."""
    if self.request.query_string:
      self.redirect('/?' + self.request.query_string)
    else:
      self.redirect('/')


DEFAULT_ROUTES = [
    (r'.*', DefaultHandler)
]

app = webapp2.WSGIApplication(DEFAULT_ROUTES)
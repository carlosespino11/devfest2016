
# coding: utf-8

# In[3]:

import os,http, http.client, urllib.request, urllib.parse, urllib.error, base64

body = '{\'URL\': \'http://i.telegraph.co.uk/multimedia/archive/02831/Clinton1web_2831249b.jpg\'}'

headers = {
   'Content-type': 'application/json',
}

params = urllib.parse.urlencode({
   # Specify your subscription key
   'subscription-key': '2ed7c5847ac640f6b0a404c72d0b96f2',
   # Specify values for optional parameters, as needed
   'analyzesFaceLandmarks': 'false',
   'analyzesAge': 'true',
   'analyzesGender': 'true',
   'analyzesHeadPose': 'true',
})


try:
   conn = http.client.HTTPSConnection('api.projectoxford.ai')
   conn.request("POST", "/face/v0/detections?%s" % params, body, headers)
   print("send request")
   response = conn.getresponse()
   data = response.read()
   print(data)
   conn.close()
except Exception as e:
   print("[Errno {0}] {1}".format(e.errno, e.strerror))


# In[ ]:



